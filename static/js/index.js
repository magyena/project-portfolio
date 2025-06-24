
const toggleBtn = document.getElementById('toggleBtn');
const projectItems = document.querySelectorAll('.project-item');

toggleBtn.addEventListener('click', function() {
    const isExpanded = this.dataset.expanded === "true";

    if (isExpanded) {
        // Sembunyikan item ke-4 dan seterusnya
        projectItems.forEach((item, index) => {
            if (index >= 3) item.classList.add('d-none');
        });
        this.textContent = "Show More";
        this.dataset.expanded = "false";
    } else {
        // Tampilkan semua
        projectItems.forEach(item => item.classList.remove('d-none'));
        this.textContent = "Show Less";
        this.dataset.expanded = "true";
    }
});

  document.addEventListener("DOMContentLoaded", () => {
  const openButtons = document.querySelectorAll(".open-modal-btn");
  const closeButtons = document.querySelectorAll(".close-modal-btn");

  openButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const modal = document.getElementById(`modal-${id}`);
      modal.classList.remove("hidden");
      startSlider(modal);
    });
  });

  closeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const modal = document.getElementById(`modal-${id}`);
      modal.classList.add("hidden");
    });
  });

  function startSlider(modal) {
    const slides = modal.querySelectorAll(".slide");
    const prev = modal.querySelector(".prev-slide");
    const next = modal.querySelector(".next-slide");
    let index = 0;

    const showSlide = (i) => {
      slides.forEach((slide, idx) => {
        slide.style.opacity = idx === i ? "1" : "0";
      });
    };

    showSlide(index);

    const nextHandler = () => {
      index = (index + 1) % slides.length;
      showSlide(index);
    };

    const prevHandler = () => {
      index = (index - 1 + slides.length) % slides.length;
      showSlide(index);
    };

    next.onclick = nextHandler;
    prev.onclick = prevHandler;

    // auto slide
    const interval = setInterval(nextHandler, 4000);

    // stop auto slide on close
    modal.querySelector(".close-modal-btn").addEventListener("click", () => {
      clearInterval(interval);
    });
  }
});
