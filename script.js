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

            // Ajouter un indicateur de chargement
            wrapper.innerHTML += '<div class="loading-overlay"><div class="spinner"></div></div>';
        };
        reader.readAsDataURL(file);
    }
});

// Mise à jour du nom en temps réel
document.querySelector('.user-name-input').addEventListener('input', function (e) {
    const nameElement = document.querySelector('.user-name');
    nameElement.textContent = e.target.value || 'Votre nom';

    const value = e.target.value;
    if (value.length > 50) {
        e.target.value = value.slice(0, 50);
        showNotification('Le nom ne peut pas dépasser 50 caractères');
    }
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

    // Appliquer les dimensions d'export optimisées
    frame.style.width = '940px';
    frame.style.height = '788px';  // Retour à la hauteur originale
    imageContainer.style.height = '500px';  // Augmentation de la hauteur du conteneur d'image

    html2canvas(frame, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        // Amélioration de la qualité du rendu
        logging: false,
        imageTimeout: 0,
        onclone: function (clonedDoc) {
            // S'assurer que les styles sont correctement appliqués dans le clone
            const clonedYouthAgenda = clonedDoc.querySelector('.youth-agenda');
            if (clonedYouthAgenda) {
                clonedYouthAgenda.style.background = 'none';
                clonedYouthAgenda.style.color = '#b87333';
            }
        }
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

// Fonction de notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 3000);
}

// Optimisation du chargement des images
function optimizeImage(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.onload = function () {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Définir une taille maximale
                const MAX_WIDTH = 1200;
                const MAX_HEIGHT = 1200;

                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                resolve(canvas.toDataURL('image/jpeg', 0.85));
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

