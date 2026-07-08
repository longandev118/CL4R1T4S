/**
 * 工作量评估 - 一键导出脚本 (浏览器控制台 / Bookmarklet)
 * =====================================================
 *
 * 用途：
 *   在 "项目规模评估 / 工作量评估" 页面，把表格里每一行抽取成
 *   【汇总工作量 / 系统名称 / 负责人 / 外包人月】，按 Tab 分隔生成文本，
 *   并自动复制到剪贴板，方便直接粘贴到 Excel / 表格里。
 *
 * 规则：
 *   1. 第一列【汇总工作量】= 所有行"外包人月"的合计；多行时每一行都重复该合计值。
 *   2. 【系统名称】为空且【类型】是"测试类"时，系统名称默认填 "测试类"。
 *   3. 单元格取值优先级：input.value -> a/span 文本 -> 单元格纯文本。
 *
 * 使用方法：
 *   1) 打开评估页面，按 F12 打开控制台(Console)。
 *   2) 把本文件内容整段粘贴进去回车；或调用 exportWorkload() 。
 *   3) 内容已复制到剪贴板，去 Excel 里 Ctrl+V 粘贴即可。
 *
 * 可选参数：
 *   exportWorkload({
 *     columns: ['系统名称', '负责人', '外包人月'], // 除"汇总工作量"外要导出的列
 *     sumColumn: '外包人月',                        // 用于合计、放到第一列的列
 *     typeColumn: '类型',                           // 判断是否"测试类"的列
 *     totalHeader: '汇总工作量',                    // 第一列表头名
 *     tableIndex: 0,                                // 页面上第几个匹配表格
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
    if (!name) return -1;
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
        typeColumn: '类型',
        totalHeader: '汇总工作量',
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
    const typeIdx = findColumn(headerMap, opts.typeColumn);
    const sysIdx = opts.columns.indexOf('系统名称');
    const sumIdx = opts.columns.indexOf(opts.sumColumn);

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

    // 第一遍：抽取每行的值 + 累计合计
    let total = 0;
    const records = [];
    bodyRows.forEach((row) => {
      const cells = [...row.cells];
      const values = colIndex.map((idx) =>
        idx >= 0 ? cellText(cells[idx]) : ''
      );
      // 空行(所有值都为空)直接跳过
      if (values.every((v) => v === '')) return;

      // 测试类且系统名称为空 -> 默认填"测试类"
      if (sysIdx >= 0 && !values[sysIdx]) {
        const type = typeIdx >= 0 ? cellText(cells[typeIdx]) : '';
        if (type.includes('测试')) values[sysIdx] = '测试类';
      }

      if (sumIdx >= 0) total += toNumber(values[sumIdx]);
      records.push(values);
    });

    // 第二遍：把合计放到第一列，多行则每行都带上
    const totalStr = total.toFixed(2);
    const lines = records.map((values) => [totalStr].concat(values).join('\t'));

    const header = [opts.totalHeader].concat(opts.columns).join('\t');
    const output = header + '\n' + lines.join('\n');

    copyToClipboard(output).then((ok) => {
      console.log(
        '%c[工作量导出] 共 ' +
          lines.length +
          ' 行，' +
          opts.sumColumn +
          '合计 ' +
          totalStr +
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
