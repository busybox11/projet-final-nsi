window.onload = function (){
    loadUserName()
}

function changeName(){
    var userName = localStorage.getItem('userName');
    if(userName){
        localStorage.removeItem("userName")
    }
    loadUserName()
}

function loadUserName(){
    var userName = localStorage.getItem('userName');
    if(!userName){
        var newname = prompt("Pseudo ? Annuler pour être anonyme")
        if(newname){
            while (newname.length<=0 || newname.length > 20){
                newname = prompt("Taper un pseudo plus court ou taper en un tout court")
            }
            localStorage.setItem("userName", newname)
            userName = newname
        }
    }
    if(!userName){
        userName = "anonymous"
    }
    document.getElementById("connectedUserName").innerHTML = userName
}