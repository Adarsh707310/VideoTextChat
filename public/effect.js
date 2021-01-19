const slide = document.getElementById("wrapper");

slide.addEventListener("mouseover",function(){
    document.getElementById("video-opt").style.height = "90px";
}) 
slide.addEventListener("mouseout",function(){
    document.getElementById("video-opt").style.height = "0px";
}) 

const mic = document.getElementsByClassName("mic");
mic[0].addEventListener("click",function(){
    mic[0].classList.toggle("mic_off");
    // var x = mic[0].textContent;
    // console.log(x);
    // if(x=="Mic On"){
    //     mic[0].textContent = "Mic Off";
    // }
    // else{
    //     mic[0].textContent = "Mic On";
    // }
})

const cam = document.getElementsByClassName("camera");
cam[0].addEventListener("click",function(){
    cam[0].classList.toggle("camera_off");
    // var x = cam[0].textContent;
    // console.log(x);
    // if(x=="Cam On"){
    //     cam[0].textContent = "Cam Off";
    // }
    // else{
    //     cam[0].textContent = "Cam On";
    // }
})