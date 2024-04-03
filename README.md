# AFAST: Automated Feedback Analysis System for Tinkoff

Временно вебсайт доступен по ссылке <https://zabojeb.github.io/tinkoff-feedback-analysis/hello.html>

Дополнительное задание выполнено в файле .ipynb

> [!NOTE]
> Некоторые функции, которые не были реализованы в прототипе буду описаны здесь.
> Поэтому прочитать README - важно!

## Ход работы
### Парсинг
Мы реализовали парсинг с двух платформ:
- <https://banki.ru>
- <https://sravni.ru>

Тем не менее, парсинг с других платформ не представляет из себя сложной задачи.

В прототипе и датасете мы используем парсинг только с banki.ru.
Поэтому код парсинга sravni.ru представим здесь:
```python
def parse_sravniru(num, page):
    data = {\"good\": [], \"bad\": []}
    r = 0
    while True:
        if r >= num:
            with open(\"output.json\", \"w\") as f:
                json.dump(data, f)
            return data
            
        req = requests.get(f\"https://www.sravni.ru/proxy-reviews/reviews/?filterBy=withRates&fingerPrint=ea060f38d490a841e5bae143a1505423&isClient=true&locationRoute=&newIds=true&orderBy=byDate&pageIndex={page}&pageSize=10&reviewObjectId=5bb4f769245bc22a520a6353&reviewObjectType=banks&specificProductId=&withVotes=true\")
        reviews = req.json()
        
        if reviews[\"items\"] == []:
            return data

        for item in reviews[\"items\"]:
            review = item[\"text\"].replace(\"\\n\", \"\").replace(\"\\r\", \"\").replace(\"\\t\", \"\")
            if review != \"\" and review != \" \" and review != \"\\n\" and review != ', ':
                if int(item[\"rating\"]) in (1, 2, 3):
                    data[\"bad\"].append(review)
                elif int(item[\"rating\"]) in (4, 5):
                    data[\"good\"].append(review)
                    
                r += 1
                
                print(f\"Получено отзывов с сравни.ру: {r}/{num}\")
                
            page += 1
```

### To-Do List
- Сортировка и фильтрация по времени
- Выявление средней оценки
- Выявление "реальной" оценки
- Отображение графиков с динамикой изменения среднй оценки
- Парсинг отзывов со sravni.ru

> [!WARNING]
> Project is WIP now.
