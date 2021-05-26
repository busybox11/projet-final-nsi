window.onload = function() {
    if (!localStorage.getItem("inputTetris")) return
    var inputTetris = localStorage.getItem("inputTetris")
    document.getElementById("downKey").innerHTML = inputTetris["down"]
}