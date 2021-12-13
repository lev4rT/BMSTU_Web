# Цель работы, решаемая проблема/предоставляемая возможность.
Форум обсуждения новостей о программировании

# Краткий перечень функциональных требований.
### Форум
* Создание форума
* Получение информации о форуме

### Ветка
* Создание ветки
* Получение информации о ветке обсуждения
* Обновление ветки
* Получение сообщений данной ветви обсуждения
* Проголосовать за ветвь обсуждения

### Пользователь
* Создание пользователя
* Получение информации о пользователях данного форума
* Изменение данных о пользователе
* Получение информации о пользователе

### Посты
* Создание новых постов
* Изменение сообщения в посте


### Другое
* Получение информации о базе данных
* Очистка всех данных в базе



# Use-case диаграмма системы.
![Use-case](./docs/img/use-case.png)

# ER-диаграмма сущностей системы.
![ER](./docs/img/ER.png)

# Нагрузочное тестирование AB
```
ab -n 50000 -c 100 -k http://127.0.0.1:8080/api/v1/
This is ApacheBench, Version 2.3 <$Revision: 1879490 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking 127.0.0.1 (be patient)
Completed 5000 requests
Completed 10000 requests
Completed 15000 requests
Completed 20000 requests
Completed 25000 requests
Completed 30000 requests
Completed 35000 requests
Completed 40000 requests
Completed 45000 requests
Completed 50000 requests
Finished 50000 requests


Server Software:        nginx/1.21.4
Server Hostname:        127.0.0.1
Server Port:            8080

Document Path:          /api/v1/
Document Length:        497 bytes

Concurrency Level:      100
Time taken for tests:   0.543 seconds
Complete requests:      50000
Failed requests:        0
Non-2xx responses:      50000
Keep-Alive requests:    49974
Total transferred:      33799870 bytes
HTML transferred:       24850000 bytes
Requests per second:    92131.93 [#/sec] (mean)
Time per request:       1.085 [ms] (mean)
Time per request:       0.011 [ms] (mean, across all concurrent requests)
Transfer rate:          60821.24 [Kbytes/sec] received

Connection Times (ms)
min  mean[+/-sd] median   max
Connect:        0    0   0.1      0       4
Processing:     0    1   1.2      1      19
Waiting:        0    1   1.2      1      19
Total:          0    1   1.2      1      21

Percentage of the requests served within a certain time (ms)
50%      1
66%      1
75%      2
80%      2
90%      2
95%      3
98%      4
99%      5
100%     21 (longest request)
```

X ПОПРАВИТЬ REST API

ПОПРАВИТЬ РЕПОЗИТОРИИ

УБРАТЬ СЕРВИСЫ

СДЕЛАТЬ КЛАСС ПОСТГРЕС С КОНЕКШЕНОМ

СДЕЛАТЬ АБСТРАКТНЫЕ РЕПОЗИТОРИИ И ИХ РЕАЛИЗАЦИЮ НА ПОСТГРЕС

СДЕЛАТЬ ДТОхи

СДЕЛАТЬ МАППЕР ДТО НА ОБЪЕКТЫ
