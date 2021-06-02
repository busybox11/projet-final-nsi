var openmodal_key = document.querySelectorAll('.modal-open-key')
for (var i = 0; i < openmodal_key.length; i++) {
    openmodal_key[i].addEventListener('click', function(event) {
        event.preventDefault()
        toggleModalKey()
    })
}

const overlay_key = document.querySelector('.modal-overlay-key')
overlay_key.addEventListener('click', toggleModalKey)

var closemodal_key = document.querySelectorAll('.modal-close-key')
for (var i = 0; i < closemodal_key.length; i++) {
    closemodal_key[i].addEventListener('click', toggleModalKey)
}

document.onkeydown = function(evt) {
    evt = evt || window.event
    var isEscape_key = false
    if ("key" in evt) {
        isEscape_key = (evt.key === "Escape" || evt.key === "Esc")
    } else {
        isEscape_key = (evt.keyCode === 27)
    }
    if (isEscape_key && document.body.classList.contains('modal-active-key')) {
        toggleModalKey()
    }
};

function toggleModalKey() {
    const body_key = document.querySelector('body')
    const modal_key = document.querySelector('.modal-key')
    modal_key.classList.toggle('opacity-0')
    modal_key.classList.toggle('pointer-events-none')
    body_key.classList.toggle('modal-active-key')
}