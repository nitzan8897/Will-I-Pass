/* =====================================================================
   data-collector.js — קריאת נתוני הטופס לאובייקטים
   collectStudentData — רקע התיכון + הקורסים הקודמים (דאטת האימון).
   collectTargetCourse — הקורס החדש לחיזוי (מאפיינים בלבד, ללא ציון).
   ===================================================================== */

function readValueById(elementId){ return document.getElementById(elementId).value; }

function readFieldsFrom(container, attribute){
  const result = {};
  container.querySelectorAll(`[${attribute}]`).forEach(element => {
    const key = element.getAttribute(attribute);
    result[key] = element.type === 'checkbox' ? element.checked
                : element.type === 'number'   ? Number(element.value)
                : element.value;
  });
  return result;
}

function collectStudentData(){
  const pastCourses = [...document.querySelectorAll('#courses .course')]
    .map(courseEl => readFieldsFrom(courseEl, 'data-field'));
  return {
    highSchool: {
      mathUnits: +readValueById('mathUnits'), mathGrade: +readValueById('mathGrade'),
      csUnits: +readValueById('csUnits'),     csGrade: +readValueById('csGrade'),
      gpa: +readValueById('gpa'),
      school: readValueById('school'), city: readValueById('city'), country: readValueById('country')
    },
    pastCourses,
    algorithm: readValueById('algo')
  };
}

function collectTargetCourse(){
  const target = readFieldsFrom(document.getElementById('target'), 'data-target');
  target.moedB = false;   // קורס עתידי — עדיין לא ניגש למועד ב'
  return target;
}
