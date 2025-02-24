document.getElementById('image-upload').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.getElementById('user-image');
            img.src = e.target.result;

            // Ajuster l'image tout en préservant l'espace pour les infos utilisateur
            img.onload = function () {
                const wrapper = document.querySelector('.image-wrapper');
                const wrapperRatio = wrapper.clientWidth / (wrapper.clientHeight - 70); // Soustraire la hauteur des infos
                const imageRatio = img.naturalWidth / img.naturalHeight;

                if (imageRatio > wrapperRatio) {
                    img.style.width = '100%';
                    img.style.height = 'auto';
                    // Centrer verticalement si nécessaire
                    const overflow = (img.clientHeight - (wrapper.clientHeight - 70)) / 2;
                    if (overflow > 0) {
                        img.style.marginTop = `-${overflow}px`;
                    }
                } else {
                    img.style.height = 'calc(100% - 70px)';
                    img.style.width = 'auto';
                    img.style.marginLeft = '50%';
                    img.style.transform = 'translateX(-50%)';
                }
            };
        };
        reader.readAsDataURL(file);
    }
});

// Mise à jour du nom en temps réel
document.querySelector('.user-name-input').addEventListener('input', function (e) {
    const nameElement = document.querySelector('.user-name');
    nameElement.textContent = e.target.value || 'Votre nom';
});

// Mise à jour du pays en temps réel
document.querySelector('.country-select').addEventListener('change', function (e) {
    const countryElement = document.querySelector('.user-country');
    countryElement.textContent = e.target.value || 'Votre pays';
});

// Fonction de téléchargement
document.getElementById('download-btn').addEventListener('click', function () {
    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Génération...';
    this.style.opacity = '0.7';

    const frame = document.querySelector('.frame');
    const imageContainer = document.querySelector('.image-container');

    // Sauvegarder les styles actuels
    const originalFrameStyle = frame.getAttribute('style') || '';
    const originalContainerStyle = imageContainer.getAttribute('style') || '';

    // Appliquer les dimensions d'export
    frame.style.width = '940px';
    frame.style.height = '788px';
    imageContainer.style.height = '450px';

    html2canvas(frame, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null
    }).then((canvas) => {
        const link = document.createElement('a');
        link.download = 'africa-japan-youth-drive.png';
        link.href = canvas.toDataURL('image/png');
        link.click();

        // Restaurer les styles originaux
        frame.setAttribute('style', originalFrameStyle);
        imageContainer.setAttribute('style', originalContainerStyle);

        // Restaurer le bouton
        this.innerHTML = '<i class="fas fa-download"></i> Télécharger';
        this.style.opacity = '1';
    });
});

