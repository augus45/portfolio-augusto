const toTopButton = document.getElementById("toTop");
const revealElements = document.querySelectorAll(".reveal");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

window.addEventListener("scroll", () => {
  if (window.scrollY > 320) {
    toTopButton.classList.add("show");
  } else {
    toTopButton.classList.remove("show");
  }
});

toTopButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealElements.forEach((element) => observer.observe(element));

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const endpoint = contactForm.getAttribute("action") || "";
    if (!endpoint || !endpoint.startsWith("https://formspree.io/f/")) {
      formStatus.className = "form-status error";
      formStatus.textContent = "El endpoint del formulario no es valido.";
      return;
    }

    const submitButton = contactForm.querySelector("button[type='submit']");
    if (submitButton) submitButton.disabled = true;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error("request failed");

      contactForm.reset();
      formStatus.className = "form-status success";
      formStatus.textContent =
        "Gracias por tu mensaje. Me pondré en contacto con vos a la brevedad.";
    } catch (_error) {
      formStatus.className = "form-status error";
      formStatus.textContent =
        "No se pudo enviar ahora. Probá de nuevo o escribime por WhatsApp.";
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}
