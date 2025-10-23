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


    
async function fetchData(type = "skills") {
    let response = await fetch("./experience.json")    
    return await response.json();
}

fetchData("experience").then(data => {
    showExperience(data);
});

function showExperience(experiences) {
    let experienceContainer = document.querySelector("#experience .timeline");
    let projectHTML = "";
    experiences.forEach((experience, i) => {
        projectHTML += `
        <div class="container `+((i % 2 == 0) ?  "right" : "left" )+`">
            <div class="content">
                <img  style="float: right; padding: 1.5px; padding-left: 0px; border-radius: 10px;" src="../assets/images/experience/${experience.image}" alt="">
                <div class="tag">
                    <a href="${experience.url}" target="_blank"> <h2>${experience.name}</h2> </a>
                </div>
                <div class="desc">
                    <h3>${experience.role}</h3>
                    <p>${experience.location}</p>
                    <p>${experience.startDate} - ${experience.endDate}</p>
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
    srtop.reveal('.experience .content', { interval: 200 });
}


});

const srtop = ScrollReveal({
    origin: 'top',
    distance: '80px',
    duration: 1000,
    reset: true
});

srtop.reveal('.experience .timeline',{delay: 400});
srtop.reveal('.experience .timeline .container',{interval: 400}); 


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