
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

function openImageModal(src) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    modalImg.src = src;
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }

  function closeImageModal() {
    const modal = document.getElementById("imageModal");
    modal.classList.remove("flex");
    modal.classList.add("hidden");
  }

  // Optional: close modal if user clicks outside the image
  document.getElementById("imageModal").addEventListener("click", function (e) {
    if (e.target === this) {
      closeImageModal();
    }
  });
   let currentSlide = 0;
  const slides = document.querySelectorAll(".slide");

  setInterval(() => {
    slides.forEach((s, i) => {
      s.classList.toggle("opacity-100", i === currentSlide);
      s.classList.toggle("z-10", i === currentSlide);
      s.classList.toggle("opacity-0", i !== currentSlide);
      s.classList.toggle("z-0", i !== currentSlide);
    });

    currentSlide = (currentSlide + 1) % slides.length;
  }, 4000);

function openImageModal(imageUrl) {
  const imageModal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  
  if (imageModal && modalImage) {
    modalImage.src = imageUrl; // Set the source of the fullscreen image
    imageModal.classList.remove('hidden'); // Show the modal
  }
}

function closeImageModal() {
  const imageModal = document.getElementById('imageModal');
  if (imageModal) {
    imageModal.classList.add('hidden'); 
    document.getElementById('modalImage').src = ''; 
  }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.open-modal-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const blogId = event.target.dataset.id;
            const modal = document.getElementById(`modal-${blogId}`);
            if (modal) {
                modal.classList.remove('hidden');
            }
        });
    });
});

function closeModal(blogId) {
    const modal = document.getElementById(`modal-${blogId}`);
    if (modal) {
        modal.classList.add('hidden');
    }
}

document.getElementById("like-button").addEventListener("click", function () {
    const blogId = document.getElementById("like-button").dataset.blogId;
  fetch(`/api/blog/${blogId}/like`, {
    method: "POST"
  })
  .then(res => res.json())
  .then(data => {
    if (data.status === "success") {
      document.getElementById("like-count").textContent = data.like_count;
    }
  });
});
