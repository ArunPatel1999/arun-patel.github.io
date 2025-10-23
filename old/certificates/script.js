$(document).ready(function(){

    $('#menu').click(function(){
        $(this).toggleClass('fa-times');
        $('.navbar').toggleClass('nav-toggle');
    });

    $(window).on('scroll load',function(){
        $('#menu').removeClass('fa-times');
        $('.navbar').removeClass('nav-toggle');
        if(window.scrollY>60){
            document.querySelector('#scroll-top').classList.add('active');
        } else {
            document.querySelector('#scroll-top').classList.remove('active');
        }
    });


    
async function fetchData() {
    let response = await fetch("./certificate.json")    
    return await response.json();
}

fetchData().then(data => {
    showCertificates(data);
});

function showCertificates(experiences) {
    let experienceContainer = document.querySelector("#certificates .box-container");
    let projectHTML = "";
    experiences.forEach((certificate) => {
        projectHTML += `
        <div class="box tilt">
            <img draggable="false" src="../assets/images/certificates/${certificate.image}" alt="project" />
            <div class="content">
                <div class="tag">
                    <h4>${certificate.title}</h4>
                </div>
                <div class="desc">
                    <p> ${certificate.title} from <strong>${certificate.org} </strong> </p>
                    <div class="btns">
                        <a href="../assets/images/certificates/${certificate.image}" class="btn" target="_blank"><i class="fas fa-eye"></i> View</a>                    
                    </div>
                </div>
            </div>
        </div>
    `});

    experienceContainer.innerHTML = projectHTML;

    /* ===== SCROLL REVEAL ANIMATION ===== */
    const srtop = ScrollReveal({
        origin: 'top',
        distance: '80px',
        duration: 1000,
        reset: true
    });

    /* SCROLL PROJECTS */
    srtop.reveal('.certificates .content', { interval: 200 });
}


});

const srtop = ScrollReveal({
    origin: 'top',
    distance: '80px',
    duration: 1000,
    reset: true
});

srtop.reveal('.certificates .timeline',{delay: 400});
srtop.reveal('.certificates .timeline .container',{interval: 400}); 


// Start of Tawk.to Live Chat
var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
    var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
    s1.async=true;
    s1.src='https://embed.tawk.to/643bb48131ebfa0fe7f8920b/1gu4ji76n';
    s1.charset='UTF-8';
    s1.setAttribute('crossorigin','*');
    s0.parentNode.insertBefore(s1,s0);
})();
// End of Tawk.to Live Chat


// disable developer mode
document.onkeydown = function(e) {
  if(e.keyCode == 123) {
     return false;
  }
  if(e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
     return false;
  }
  if(e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
     return false;
  }
  if(e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
     return false;
  }
  if(e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
     return false;
  }
}

document.addEventListener('visibilitychange',
function(){
    if(document.visibilityState === "visible"){
        document.title = "Experience | Portfolio Arun Patel";
        $("#favicon").attr("href","/assets/images/my_images/yellowbg.png");
    }
    else {
        document.title = "Come Back To Portfolio";
        $("#favicon").attr("href","/assets/images/favhand.png");
    }
});