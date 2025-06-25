const toggleBtn = document.getElementById('toggleBtn');
const projectItems = document.querySelectorAll('.project-item');

toggleBtn.addEventListener('click', function() {
    const isExpanded = this.dataset.expanded === "true";

    if (isExpanded) {
        projectItems.forEach((item, index) => {
            if (index >= 3) item.classList.add('d-none');
        });
        this.textContent = "Show More";
        this.dataset.expanded = "false";
    } else {
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
            startSlider(modal); // Panggil startSlider saat modal dibuka
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
        const slideContainer = modal.querySelector(".slide-container"); // Target container spesifik
        const slides = modal.querySelectorAll(".slide");
        const prev = modal.querySelector(".prev-slide");
        const next = modal.querySelector(".next-slide");
        let index = 0;

        // Bersihkan interval yang mungkin sudah ada sebelumnya untuk modal ini
        if (modal.dataset.sliderInterval) {
            clearInterval(parseInt(modal.dataset.sliderInterval));
        }

        const showSlide = (i) => {
            slides.forEach((slide, idx) => {
                slide.style.opacity = idx === i ? "1" : "0";
                slide.style.zIndex = idx === i ? "10" : "0"; // Pastikan z-index juga diatur
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

        if (next && prev) {
            next.onclick = nextHandler;
            prev.onclick = prevHandler;
        }

        const interval = setInterval(nextHandler, 4000);
        modal.dataset.sliderInterval = interval.toString(); // Simpan ID interval di dataset modal

        const closeModalButton = modal.querySelector(".close-modal-btn");
        if (closeModalButton) {
            closeModalButton.addEventListener("click", () => {
                clearInterval(interval);
            });
        }

        // --- Perbaikan Utama: Tambahkan Event Listener Klik Gambar di sini ---
        // Hapus listener sebelumnya jika ada (untuk mencegah duplikasi)
        const oldClickListener = modal.dataset.imageClickListener;
        if (oldClickListener) {
            slideContainer.removeEventListener('click', eval(oldClickListener));
        }

        const newClickListener = function(event) {
            if (event.target.tagName === 'IMG') {
                openImageModal(event.target.src);
            }
        };
        slideContainer.addEventListener('click', newClickListener);
        modal.dataset.imageClickListener = newClickListener.toString(); // Simpan referensi listener
        // --- Akhir Perbaikan Utama ---
    }

    // Fungsi openImageModal dan closeImageModal tetap sama
});

function openImageModal(imageUrl) {
    const imageModal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    if (imageModal && modalImg) {
        modalImg.src = imageUrl;
        imageModal.classList.remove("hidden");
        imageModal.classList.add("flex");
    }
}

function closeImageModal() {
    const modal = document.getElementById("imageModal");
    if (modal) {
        modal.classList.remove("flex");
        modal.classList.add("hidden");
        document.getElementById("modalImage").src = '';
    }
}

document.getElementById("imageModal").addEventListener("click", function (e) {
    if (e.target === this) {
        closeImageModal();
    }
});

function closeModal(blogId) {
    const modal = document.getElementById(`modal-${blogId}`);
    if (modal) {
        modal.classList.add('hidden');
    }
}

document.querySelectorAll(".like-button").forEach(button => {
    button.addEventListener("click", function () {
        const blogId = this.dataset.blogId;
        const countSpan = this.querySelector(".like-count");
        const heart = this.querySelector(".heart-icon");

        fetch(`/api/blog/${blogId}/like`, {
            method: "POST"
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === "success") {
                countSpan.textContent = data.like_count;
                heart.classList.add("scale-150", "opacity-70");
                setTimeout(() => {
                    heart.classList.remove("scale-150", "opacity-70");
                }, 200);
            }
        });
    });
});