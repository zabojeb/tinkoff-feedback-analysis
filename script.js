document.addEventListener('DOMContentLoaded', function() {
    const personalCabinetBtn = document.getElementById('personal-cabinet-btn');
    
    personalCabinetBtn.addEventListener('click', function() {
        window.location.href = './profile.html';
    });

    const categorySelect = document.getElementById('category');
    const reviewsContainer = document.getElementById('reviews');

    categorySelect.addEventListener('change', function() {
        const selectedCategory = this.value;
        filterReviews(selectedCategory);
    });

    function filterReviews(category_num) {
        fetch('https://storage.yandexcloud.net/tinkoff-ai/final500fr.json')
            .then(response => response.json())
            .then(data => {
                reviewsContainer.innerHTML = '';
                
                console.log(data);
                
                Object.keys(data.author).forEach(key => {
                    const author = data.author[key];
                    const datePublished = new Date(data.datePublished[key]);
                    const description = data.description[key];
                    const name = data.name[key];
                    const ratingValue = data.ratingValue[key];
                    const field = data.categories[key]; // Преобразуем поле в строку
                    const source = data.source[key]

                    const cats_by_nums = {'1': 'Кэшбек',
                    '2': 'Акции',
                    '3': 'Банковские карты',
                    '4': 'Кредиты',
                    '5': 'Подписки',
                    '6': 'Вклады',
                    '7': 'Инвестиции',
                    '8': 'Сим-карты',
                    '9': 'Страхование',
                    '10': 'Путешествия',
                    '11': 'Бизнес',
                    '12': 'Сотрудники',
                    '13': 'Обслуживание',
                    '14': 'ППВЗ',
                    '15': 'Блокировка/Разблокировка счета',
                    '16': 'Мобильное приложение и сайт',
                    '17': 'Другое'};

                    const cats = [];
                    for (let i = 0; i < field.length; i++){
                        cats.push(cats_by_nums[field[i]])
                    }
                    
                    category = cats_by_nums[category_num];

                    console.log(category)
                    const emotion = data.emotion[key][0].label;
                    if (!category || cats.includes(category)) {
                        const review = document.createElement('div');
                        review.classList.add('review');
                        review.innerHTML = `
                            <h3>${name}</h3>
                            <p><strong>Автор:</strong> ${author}</p>
                            <p><strong>Дата:</strong> ${datePublished.toLocaleString()}</p>
                            <p><strong>Источник:</strong> <a href=https://${source.slice(0, -2) + '.ru'}>${source.slice(0, -2) + '.ru'}</a></p>
                            <p><strong>Оценка:</strong> ${ratingValue}</p>
                            <p><strong>Эмоциональная окраска:</strong> ${emotion}</p>
                            <div class="markdown-container">${showdownConverter.makeHtml(description)}</div>
                            <p><strong>Категории:</strong></p>
                            ${cats.map(category => `<div class="category">${category.trim()}</div>`).join('')}
                            <button class="analyze-btn" data-index="${key}">Проанализировать</button>
                        `;
                        reviewsContainer.appendChild(review);
                        /*let reviewElement = document.querySelector('.review');
                    if (ratingValue == "5") {
                        reviewElement.style.backgroundColor = "#00ff00"
                    }
                    else {
                        reviewElement.style.backgroundColor = "#ff0000";
                    }*/
                    }
                    
                });

                // Добавляем обработчик события для каждой кнопки "Проанализировать"
                const analyzeButtons = document.querySelectorAll('.analyze-btn');
                analyzeButtons.forEach(button => {
                    button.addEventListener('click', function() {
                        const index = this.getAttribute('data-index');
                        analyzeReview(data, index);
                    });
                });
            })
            .catch(error => {
                console.error('Ошибка при загрузке отзывов:', error);
            });
    }

    async function analyzeReview(data, index) {
        const requestBody = { review: data.description[index] }; // Отправляем текст отзыва
    
        try {
            const response = await fetch("https://functions.yandexcloud.net/d4eh8qhr5onkp8u2499n", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            });
    
            if (!response.ok) {
                throw new Error("Ошибка при отправке запроса");
            }
    
            const responseData = await response.json();
            const analyzedText = "### **Результаты анализа:**\n\n" + responseData.result.alternatives[0].message.text;
    
            // Создаем экземпляр конвертера Markdown
            const converter = new showdown.Converter();
            
            // Преобразуем текст Markdown в HTML
            const html = converter.makeHtml(analyzedText);
    
            // Создаем элемент для отображения результатов анализа
            const analysisResult = document.createElement('div');
            analysisResult.innerHTML = html;
    
            // Находим родительский элемент кнопки "Проанализировать"
            const parentElement = document.querySelector(`.analyze-btn[data-index="${index}"]`).parentNode;
    
            // Вставляем результаты анализа после кнопки "Проанализировать"
            parentElement.appendChild(analysisResult);
        } catch (error) {
            console.error('Ошибка при анализе отзыва:', error);
            alert('Произошла ошибка при анализе отзыва');
        }
    }
    
    
    const showdownConverter = new showdown.Converter();


    filterReviews(null); // Показываем все отзывы при загрузке страницы
});
