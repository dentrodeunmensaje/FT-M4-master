
/* Buscá todas las películas filmadas en el año que naciste.*/
SELECT name, year FROM movies WHERE year = 1984;

/* Cuantas películas hay en la DB que sean del año 1982? */
SELECT COUNT(*) as Total FROM movies WHERE year = 1982;


/* Buscá actores que tengan el substring stack en su apellido.*/
SELECT name, last_name FROM actors WHERE last_name LIKE '%stack%';

/*Buscá los 10 nombres y apellidos más populares entre los actores. Cuantos actores tienen cada uno de esos nombres y apellidos?*/
SELECT first_name, last_name, COUNT(*) AS Total FROM actors GROUP BY lower(first_name), lower(last_name) ORDER BY Total DESC LIMIT 10;

/*Listá el top 100 de actores más activos junto con el número de roles que haya realizado.*/
SELECT actors.first_name, actors.last_name, COUNT(*) AS Total FROM actors JOIN roles ON actors.id = roles.actor_id GROUP BY actors.id ORDER BY Total DESC LIMIT 100;

/* Cuantas películas tiene IMDB por género? Ordená la lista por el género menos popular.*/
SELECT genre, COUNT(*) AS Total FROM movies_genres GROUP BY genre ORDER BY Total DESC;

/* Listá el nombre y apellido de todos los actores que trabajaron en la película "Braveheart" de 1995, ordená la lista alfabéticamente por apellido.*/
SELECT actors.first_name, actors.last_name 
FROM actors 
JOIN roles ON actors.id = roles.actor_id 
JOIN movies ON roles.movie_id = movies.id 
WHERE movies.name = 'Braveheart' AND movies.year = 1995 
ORDER BY actors.last_name;

/*Listá todos los directores que dirigieron una película de género 'Film-Noir' en un año bisiesto (para reducir la complejidad, asumí que cualquier año divisible por cuatro es bisiesto). Tu consulta debería devolver el nombre del director, el nombre de la peli y el año. Todo ordenado por el nombre de la película.*/
SELECT directors.first_name, directors.last_name, movies.name, movies.year
FROM directors
JOIN movies_directors ON directors.id = movies_directors.director_id
JOIN movies ON movies_directors.movie_id = movies.id
JOIN movies_genres ON movies.id = movies_genres.movie_id
WHERE movies_genres.genre = 'Film-Noir' AND movies.year % 4 = 0
ORDER BY movies.name;


/* Listá todos los actores que hayan trabajado con Kevin Bacon en películas de Drama (incluí el título de la peli). Excluí al señor Bacon de los resultados.*/

SELECT actors.first_name, actors.last_name
FROM actors
JOIN roles ON actors.id = roles.actor_id
JOIN movies ON roles.movie_id = movies.id
JOIN movies_genres ON movies.id = movies_genres.movie_id
WHERE movies_genres.genre = 'Drama' AND movies.id IN(
    SELECT roles.movie_id
    FROM roles 
    JOIN actors ON roles.actor_id = actors.id 
    WHERE first_name = 'Kevin' AND last_name = 'Bacon' 
) AND ( actors.first_name || ' ' || actors.last_name  != 'Kevin Bacon');

/* Qué actores actuaron en una película antes de 1900 y también en una película después del 2000?*/
SELECT *
FROM actors
where id in(
    SELECT actor_id
    FROM roles
    join movies on roles.movie_id = movies.id
    where movies.year < 1900
) and id in(
    SELECT actor_id
    FROM roles
    join movies on roles.movie_id = movies.id
    where movies.year > 2000
);

/*Buscá actores que actuaron en cinco o más roles en la misma película después del año 1990. 
Noten que los ROLES pueden tener duplicados ocasionales, sobre los cuales no estamos interesados: 
queremos actores que hayan tenido cinco o más roles DISTINTOS (DISTINCT cough cough) en la misma película.
 Escribí un query que retorne los nombres del actor, el título de la película y el número de roles (siempre debería ser > 5). */

SELECT actors.first_name, actors.last_name, count(DISTINCT(r.role)) as Total
FROM actors as a
JOIN roles as r ON a.id = r.actor_id
join movies as m on r.movie_id = m.id
where m.year > 1990
group by r.actor_id, r.movie_id
having Total > 5;

/* Para cada año, contá el número de películas en ese año que sólo tuvieron actrices femeninas.*/
SELECT year, count (DISTINCT id)
from movies where
id not in (
    select r.movie_id from roles as r 
    join actors as a on r.actor_id = a.id
    where a.gender = 'M'
)
GROUP by year;  
.exit










