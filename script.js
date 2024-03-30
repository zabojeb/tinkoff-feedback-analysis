document.addEventListener('DOMContentLoaded', function() {
    const categorySelect = document.getElementById('category');
    const reviewsContainer = document.getElementById('reviews');

    categorySelect.addEventListener('change', function() {
        const selectedCategory = this.value;
        filterReviews(selectedCategory);
    });

    function filterReviews(category) {
        fetch('https://raw.githubusercontent.com/zabojeb/tinkoff-feedback-analysis/main/database.json')
            .then(response => response.json())
            .then(data => {
                reviewsContainer.innerHTML = '';

                Object.keys(data.author).forEach(key => {
                    const author = data.author[key];
                    const datePublished = new Date(data.datePublished[key]);
                    const description = data.description[key];
                    const name = data.name[key];
                    const ratingValue = data.ratingValue[key];
                    const field = String(data.field[key]); // Преобразуем поле в строку

                    if (!category || field.toLowerCase().includes(category.toLowerCase())) {
                        const review = document.createElement('div');
                        review.classList.add('review');
                        review.innerHTML = `
                            <h3>${name}</h3>
                            <p><strong>Автор:</strong> ${author}</p>
                            <p><strong>Дата:</strong> ${datePublished.toLocaleString()}</p>
                            <p><strong>Оценка:</strong> ${ratingValue}</p>
                            <p><strong>Отзыв:</strong> ${description}</p>
                            <p><strong>Категория:</strong> ${field}</p>
                        `;
                        reviewsContainer.appendChild(review);
                    }
                });
            })
            .catch(error => {
                console.error('Ошибка при загрузке отзывов:', error);
            });
    }

    filterReviews(null); // Показываем все отзывы при загрузке страницы
});
