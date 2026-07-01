/* =====================================================================
   course-list.js — רשימת הקורסים הקודמים הדינמית (דאטת האימון)
   כל קורס כולל את הציון שהתקבל בו — זו התווית שהמודל לומד ממנה.
   ===================================================================== */
let nextCourseIndex = 0;

function addCourse(prefillValues){
  const index = nextCourseIndex++;
  const courseEl = document.createElement('div');
  courseEl.className = 'course';
  courseEl.innerHTML = `
    <div class="head"><b>קורס #${index + 1}</b><button class="del" onclick="this.closest('.course').remove()">🗑 הסר</button></div>
    <div class="grid">
      <div class="fld"><label>שם הקורס</label><input data-field="name" value=""></div>
      <div class="fld"><label>שם המרצה</label><input data-field="lecturer" value=""></div>
      <div class="fld"><label>נקודות זכות</label><input data-field="credits" type="number" value="4"></div>
      <div class="fld chk"><input type="checkbox" data-field="isMath" id="m${index}" checked><label for="m${index}">דורש חשיבה מתמטית</label></div>
      <div class="fld chk"><input type="checkbox" data-field="isCS" id="c${index}"><label for="c${index}">דורש חשיבת מדעי המחשב</label></div>
      <div class="fld"><label>שעות לימוד החומר בפעם הראשונה</label><input data-field="firstLearnHrs" type="number" value="30"></div>
      <div class="fld"><label>שעות הכנה למבחן (תרגול+מבחנים)</label><input data-field="examPrepHrs" type="number" value="25"></div>
      <div class="fld"><label>שעות יומיות של פתרון מבחנים</label><input data-field="dailyPastExamHrs" type="number" value="2"></div>
      <div class="fld chk"><input type="checkbox" data-field="practiceAfter" id="p${index}" checked><label for="p${index}">תרגל מיד אחרי הרצאות / תרגול</label></div>
      <div class="fld"><label>משקל שיעורי הבית (%)</label><input data-field="hwWeight" type="number" value="15"></div>
      <div class="fld"><label>הגשת שיעורי הבית</label>
        <select data-field="hwHonesty">
          <option value="independent">עצמאי</option>
          <option value="partial">חלקי</option>
          <option value="cheated">העתקה / שימוש ב-AI</option>
        </select></div>
    </div>
    <div class="cond show" style="border-color:var(--blue)">
      <b style="color:var(--blue);font-size:13px">שיטת לימוד למבחן (% מהזמן)</b>
      <div class="pct-row" style="margin-top:8px">
        <div class="fld"><label>לבד</label><input data-field="methodSolo" type="number" value="60"></div>
        <div class="fld"><label>עם חבר</label><input data-field="methodFriend" type="number" value="30"></div>
        <div class="fld"><label>מורה פרטי</label><input data-field="methodTutor" type="number" value="10"></div>
      </div>
    </div>
    <div class="grid" style="margin-top:10px">
      <div class="fld"><label>ציון מבחן סופי</label><input data-field="finalExam" type="number" value="75"></div>
      <div class="fld"><label>ממוצע הקורס (תווית האימון)</label><input data-field="courseAvg" type="number" value="78"></div>
      <div class="fld chk"><input type="checkbox" data-field="moedB" id="mb${index}"><label for="mb${index}">ניגש למועד ב'</label></div>
    </div>`;
  document.getElementById('courses').appendChild(courseEl);
  if (prefillValues) applyPrefill(courseEl, prefillValues);
}

function applyPrefill(courseEl, values){
  Object.entries(values).forEach(([field, value]) => {
    const input = courseEl.querySelector(`[data-field="${field}"]`);
    if (!input) return;
    if (input.type === 'checkbox') input.checked = !!value; else input.value = value;
  });
}
