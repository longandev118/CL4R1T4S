/**
 * 工作量评估 - 一键导出脚本 (浏览器控制台 / Bookmarklet)
 * =====================================================
 *
 * 用途：
 *   在 "项目规模评估 / 工作量评估" 页面，把表格里每一行的
 *   【系统名称 / 负责人 / 外包人月】抽取出来，按 Tab 分隔生成文本，
 *   并自动复制到剪贴板，方便直接粘贴到 Excel / 表格里。
 *
 * 相比手写一行流的改进：
 *   1. 按【表头名称】自动定位列，不再写死列序号，页面列顺序变了也不会错位。
 *   2. 单元格取值优先级：input.value -> a/span 文本 -> 单元格纯文本。
 *   3. 自动合计【外包人月】，并输出汇总行。
 *   4. 复制失败时自动回退到 navigator.clipboard，并把内容打印到控制台。
 *
 * 使用方法：
 *   1) 打开评估页面，按 F12 打开控制台(Console)。
 *   2) 把本文件内容整段粘贴进去回车；或调用 exportWorkload() 。
 *   3) 内容已复制到剪贴板，去 Excel 里 Ctrl+V 粘贴即可。
 *
 * 可选参数：
 *   exportWorkload({
 *     columns: ['系统名称', '负责人', '外包人月'], // 要导出的列(按表头名匹配)
 *     sumColumn: '外包人月',                        // 需要合计的列
 *     tableIndex: 0,                                // 第几个表格(默认第一个匹配到的)
 *   });
 */

(function () {
  'use strict';

  /** 读取单元格文本：优先输入框的值，其次链接/文本节点，最后取纯文本。 */
  function cellText(cell) {
    if (!cell) return '';
    const input = cell.querySelector('input, textarea');
    if (input) return (input.value || '').trim();
    const inline = cell.querySelector('a, span');
    if (inline && inline.textContent.trim()) return inline.textContent.trim();
    return (cell.textContent || '').trim();
  }

  /** 把 "0.16人月" / "0.16" 这类文本解析成数字，解析不出来返回 0。 */
  function toNumber(text) {
    const m = String(text).replace(/,/g, '').match(/-?\d+(\.\d+)?/);
    return m ? parseFloat(m[0]) : 0;
  }

  /** 找到表头行，返回 { 表头名: 列序号 } 映射。 */
  function buildHeaderMap(table) {
    const headerRow =
      (table.tHead && table.tHead.rows[0]) || table.rows[0];
    const map = {};
    if (!headerRow) return map;
    [...headerRow.cells].forEach((cell, i) => {
      const name = (cell.textContent || '').replace(/\s+/g, '').trim();
      if (name) map[name] = i;
    });
    return map;
  }

  /** 在页面里挑出"看起来像工作量评估"的表格。 */
  function pickTable(tableIndex, wantedColumns) {
    const tables = [...document.querySelectorAll('table')];
    const matched = tables.filter((t) => {
      const headers = Object.keys(buildHeaderMap(t));
      return wantedColumns.every((c) =>
        headers.some((h) => h.includes(c))
      );
    });
    const pool = matched.length ? matched : tables;
    return pool[tableIndex] || pool[0] || null;
  }

  /** 在表头映射里按"包含"匹配列名，返回列序号或 -1。 */
  function findColumn(headerMap, name) {
    if (name in headerMap) return headerMap[name];
    const hit = Object.keys(headerMap).find((h) => h.includes(name));
    return hit ? headerMap[hit] : -1;
  }

  function copyToClipboard(text) {
    // 控制台环境优先用 DevTools 的 copy()
    try {
      if (typeof copy === 'function') {
        copy(text);
        return Promise.resolve(true);
      }
    } catch (e) {
      /* 忽略，走下面的回退 */
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(
        () => true,
        () => false
      );
    }
    return Promise.resolve(false);
  }

  function exportWorkload(options) {
    const opts = Object.assign(
      {
        columns: ['系统名称', '负责人', '外包人月'],
        sumColumn: '外包人月',
        tableIndex: 0,
      },
      options || {}
    );

    const table = pickTable(opts.tableIndex, opts.columns);
    if (!table) {
      console.error('[工作量导出] 页面上没找到表格。');
      return '';
    }

    const headerMap = buildHeaderMap(table);
    const colIndex = opts.columns.map((c) => findColumn(headerMap, c));

    const missing = opts.columns.filter((c, i) => colIndex[i] < 0);
    if (missing.length) {
      console.warn(
        '[工作量导出] 这些列没在表头里找到，会输出空值：' + missing.join('、')
      );
    }

    // 跳过表头行，取数据行
    const startRow = table.tHead ? 0 : 1;
    const bodyRows = table.tBodies.length
      ? [...table.tBodies].flatMap((tb) => [...tb.rows])
      : [...table.rows].slice(startRow);

    let total = 0;
    const sumIdx = opts.columns.indexOf(opts.sumColumn);

    const lines = bodyRows
      .map((row) => {
        const cells = [...row.cells];
        const values = colIndex.map((idx) =>
          idx >= 0 ? cellText(cells[idx]) : ''
        );
        // 空行(所有值都为空)直接跳过
        if (values.every((v) => v === '')) return null;
        if (sumIdx >= 0) total += toNumber(values[sumIdx]);
        return values.join('\t');
      })
      .filter((l) => l !== null);

    const header = opts.columns.join('\t');
    const summary =
      sumIdx >= 0
        ? '\n合计\t' +
          opts.columns
            .map((c, i) => (i === sumIdx ? total.toFixed(2) : ''))
            .slice(1)
            .join('\t')
        : '';

    const output = header + '\n' + lines.join('\n') + summary;

    copyToClipboard(output).then((ok) => {
      console.log(
        '%c[工作量导出] 共 ' +
          lines.length +
          ' 行' +
          (sumIdx >= 0 ? '，' + opts.sumColumn + '合计 ' + total.toFixed(2) : '') +
          (ok ? '，已复制到剪贴板 ✔' : '，复制失败，请手动复制下方内容 ✖'),
        'color:#2b8a3e;font-weight:bold'
      );
      console.log(output);
    });

    return output;
  }

  // 暴露到全局，方便二次调用；同时立即执行一次默认导出。
  window.exportWorkload = exportWorkload;
  exportWorkload();
})();
