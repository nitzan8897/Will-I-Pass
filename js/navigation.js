/* =====================================================================
   navigation.js — מעבר בין לשוניות הסרגל הצדדי
   ===================================================================== */
function setupNavigation(){
  document.querySelectorAll('.nav button').forEach(navButton => {
    navButton.addEventListener('click', () => {
      document.querySelectorAll('.nav button').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('show'));
      navButton.classList.add('active');
      document.getElementById(navButton.dataset.tab).classList.add('show');
      if (navButton.dataset.tab === 'export') refreshPreview();
    });
  });
}
