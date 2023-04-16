$(document).ready(function () {
    
    const totalExperience = document.getElementById("total_experience");
    
    totalExperience.innerHTML  += ""+getTotalExperience();

    function getTotalExperience() {
        const startDate = new Date("February 1, 2021"); 
        const now = new Date(); 
        var monthsOfExperience = (now.getFullYear() - startDate.getFullYear()) * 12 + now.getMonth() - startDate.getMonth(); 
        monthsOfExperience = monthsOfExperience +1 ;
        const yearsOfExperience = monthsOfExperience / 12; 
        return yearsOfExperience.toFixed(1);
    }


    $('#menu').click(function () {
        $(this).toggleClass('fa-times');
        $('.navbar').toggleClass('nav-toggle');
    });

    $(window).on('scroll load', function () {
        $('#menu').removeClass('fa-times');
        $('.navbar').removeClass('nav-toggle');

        if (window.scrollY > 60) {
            document.querySelector('#scroll-top').classList.add('active');
        } else {
            document.querySelector('#scroll-top').classList.remove('active');
        }

        // scroll spy
        $('section').each(function () {
            let height = $(this).height();
            let offset = $(this).offset().top - 200;
            let top = $(window).scrollTop();
            let id = $(this).attr('id');

            if (top > offset && top < offset + height) {
                $('.navbar ul li a').removeClass('active');
                $('.navbar').find(`[href="#${id}"]`).addClass('active');
            }
        });
    });

    // smooth scrolling
    $('a[href*="#"]').on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top,
        }, 500, 'linear')
    });

    // <!-- emailjs to mail contact form data -->
    $("#contact-form").submit(function (event) {
        emailjs.init("user_TTDmetQLYgWCLzHTDgqxm");

        emailjs.sendForm('contact_service', 'template_contact', '#contact-form')
            .then(function (response) {
                console.log('SUCCESS!', response.status, response.text);
                document.getElementById("contact-form").reset();
                alert("Form Submitted Successfully");
            }, function (error) {
                console.log('FAILED...', error);
                alert("Form Submission Failed! Try Again");
            });
        event.preventDefault();
    });
    // <!-- emailjs to mail contact form data -->

});

document.addEventListener('visibilitychange',
    
    function () {
        if (document.visibilityState === "visible") {
            document.title = "Portfolio | Arun Patel";
            $("#favicon").attr("href", "assets/images/my_images/yellowbg.png");
        }
        else {
            document.title = "Come Back To Portfolio";
            $("#favicon").attr("href", "assets/images/favhand.png");
        }
    });

    var typed = new Typed(".typing-text", {
        strings: ["software development"],
        loop: true,
        typeSpeed: 50,
        backSpeed: 25,
        backDelay: 500,
    });


async function fetchData(type = "skills") {
    let response ;
    if(type === "skills") 
        response = await fetch("skills.json")
    else if(type === "experience")
        response = await fetch("./experience/experience.json")
    else
        response = await fetch("./projects/projects.json")
    const data = await response.json();
    return data;
}

fetchData().then(data => {
    showSkills(data);
});

fetchData("experience").then(data => {
    showExperience(data);
});

fetchData("projects").then(data => {
    showProjects(data);
});

function showSkills(skills) {
    let skillsContainer = document.getElementById("skillsContainer");
    let skillHTML = "";
    skills.forEach(skill => {
        skillHTML += `
        <div class="bar">
            <div class="info">
                <img src=${skill.icon} alt="skill" />
                <span>${skill.name}</span>
            </div>
        </div>
    `});
    skillsContainer.innerHTML = skillHTML;
}


function showExperience(experiences) {
    let experienceContainer = document.querySelector("#experience .timeline");
    let projectHTML = "";
    experiences.slice(0, 4).forEach((experience, i) => {
        projectHTML += `
        <div class="container `+((i % 2 == 0) ?  "right" : "left" )+`">
            <div class="content">
                <img  style="float: right; padding: 1.5px; padding-left: 0px; border-radius: 10px;" src="./assets/images/experience/${experience.image}" alt="">
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

    if(experiences.length > 4) {
        projectHTML += `
        <div class="morebtn">
            <a href="/experience" class="btn">
                <span>View All</span>
                <i class="fas fa-arrow-right"></i>
            </a>
        </div>
    `}
    experienceContainer.innerHTML = projectHTML;

    // <!-- tilt js effect ends -->
    VanillaTilt.init(document.querySelectorAll(".tilt"), {
        max: 15,
    });
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

function showProjects(projects) {
    let projectsContainer = document.querySelector("#work .box-container");
    let projectHTML = "";
    projects.slice(0, 10).forEach(project => {
        projectHTML += `
        <div class="box tilt">
            <img draggable="false" src="/assets/images/projects/${project.image}.png" alt="project" />
            <div class="content">
                <div class="tag">
                    <h3>${project.name} - ${project.category}</h3>
                </div>
                <div class="desc">`+
                    ((typeof project.technologies.backend !== "undefined") ? `<p> <strong style="color:#28B463;" > Backend: </strong> <b style="font-size:13px"> ${project.technologies.backend} </b></p>` : ``) +
                    ((typeof project.technologies.frontend !== "undefined") ? `<p> <strong style="color:#28B463;"> Frontend: </strong> <b style="font-size:13px"> ${project.technologies.frontend}</b></p>` : ``)          
                  +`<p> <strong style="color:#28B463;"> Desc: </strong> ${project.desc}</p>
                    <div class="btns">
                        <a href="${project.links.view}" class="btn" target="_blank"><i class="fas fa-eye"></i> View</a>
                        <a href="${project.links.code}" class="btn" target="_blank">Code <i class="fas fa-code"></i></a>
                    </div>
                </div>
            </div>
        </div>
    `});
    if(projects.length > 10) {
        projectHTML += `
        <div class="morebtn">
            <a href="/projects" class="btn">
                <span>View All</span>
                <i class="fas fa-arrow-right"></i>
            </a>
        </div>
    `}
    projectsContainer.innerHTML = projectHTML;

    // <!-- tilt js effect starts -->
    VanillaTilt.init(document.querySelectorAll(".tilt"), {
        max: 15,
    });
    // <!-- tilt js effect ends -->

    /* ===== SCROLL REVEAL ANIMATION ===== */
    const srtop = ScrollReveal({
        origin: 'top',
        distance: '80px',
        duration: 1000,
        reset: true
    });

    /* SCROLL PROJECTS */
    srtop.reveal('.work .box', { interval: 200 });
}


// <!-- tilt js effect starts -->
VanillaTilt.init(document.querySelectorAll(".tilt"), {
    max: 15,
});
// <!-- tilt js effect ends -->


// disable developer mode
document.onkeydown = function (e) {
    if (e.keyCode == 123) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
        return false;
    }
}

// Start of Tawk.to Live Chat
var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
(function () {
    var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
    s1.async = true;
    s1.src = 'https://embed.tawk.to/60df10bf7f4b000ac03ab6a8/1f9jlirg6';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    s0.parentNode.insertBefore(s1, s0);
})();
// End of Tawk.to Live Chat


/* ===== SCROLL REVEAL ANIMATION ===== */
const srtop = ScrollReveal({
    origin: 'top',
    distance: '80px',
    duration: 1000,
    reset: true
});

/* SCROLL HOME */
srtop.reveal('.home .content h3', { delay: 200 });
srtop.reveal('.home .content p', { delay: 200 });
srtop.reveal('.home .content .btn', { delay: 200 });

srtop.reveal('.home .image', { delay: 400 });
srtop.reveal('.home .linkedin', { interval: 600 });
srtop.reveal('.home .github', { interval: 800 });
srtop.reveal('.home .twitter', { interval: 1000 });
srtop.reveal('.home .telegram', { interval: 600 });
srtop.reveal('.home .instagram', { interval: 600 });
srtop.reveal('.home .dev', { interval: 600 });

/* SCROLL ABOUT */
srtop.reveal('.about .content h3', { delay: 200 });
srtop.reveal('.about .content .tag', { delay: 200 });
srtop.reveal('.about .content p', { delay: 200 });
srtop.reveal('.about .content .box-container', { delay: 200 });
srtop.reveal('.about .content .resumebtn', { delay: 200 });


/* SCROLL SKILLS */
srtop.reveal('.skills .container', { interval: 200 });
srtop.reveal('.skills .container .bar', { delay: 400 });

/* SCROLL EDUCATION */
srtop.reveal('.education .box', { interval: 200 });

/* SCROLL PROJECTS */
srtop.reveal('.work .box', { interval: 200 });

/* SCROLL EXPERIENCE */
srtop.reveal('.experience .timeline', { delay: 400 });
srtop.reveal('.experience .timeline .container', { interval: 400 });

/* SCROLL CONTACT */
srtop.reveal('.contact .container', { delay: 400 });
srtop.reveal('.contact .container .form-group', { delay: 400 });