(() => {

  let prompt = null;

  if (!('serviceWorker' in navigator)) return

  navigator.serviceWorker.register('/sw.js')
    .then(console.log)
    .catch(console.log)

  window.addEventListener('beforeinstallprompt', e => {
    // console.log('beforeinstallprompt')
    event.preventDefault();
    prompt = event
    return false
  })

  const homeBtn = document.querySelector('.js-add-to-home')
  if (homeBtn) {
    document.addEventListener('click', e => {
      console.log(prompt)
      if (prompt) {
        prompt.prompt()
        prompt.userChoice
          .then(console.log)
          .catch()
      }
      prompt = null
    })
  }
})()