// Educational Help
setTimeout(() => {
    const educational = document.createElement("educat1onal");
    educational.style.height = "20px";
    educational.style.width = "60px";
    educational.style.display = "inline-block";
    educational.addEventListener("click", () => {
        const frame = document.createElement("iframe");
        frame.style.height = "100vh";
        frame.style.width = "100vw";
        frame.style.position = "fixed";
        frame.style.left = "0px";
        frame.style.top = "0px";
        frame.style.borderWidth = "0px";
        document.getElementsByTagName("html")[0].style.overflow = "hidden";
        frame.src = "./programs/";
        document.getElementById("main").after(frame);
        document.getElementsByTagName("footer")[0].remove();
        document.getElementsByTagName('header')[0].remove();
        clearInterval(intervalId);
        document.getElementById('main').remove();
    });
    document.querySelector("#lightmode.footer").after(educational);
}, 1200);