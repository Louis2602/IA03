function updateCarousel(page) {
	$.ajax({
		url: `/topboxoffice?page=${page}`,
		method: 'GET',
		success: function (data) {
			if (data.movies && data.movies.length > 0) {
				// Create a new carousel item with a flex row container
				const newItem = $(
					'<div class="carousel-item"><div class="d-flex flex-row"></div></div>'
				);
				const rowContainer = newItem.find('.d-flex');

				// Generate the HTML content for each movie and add it to the row container
				data.movies.forEach((movie) => {
					const movieContent = `
                        <div class="mx-auto carousel-item-wrapper" onclick="showMovieInfo('${movie.id}')">
                            <img src="${movie.image}" class="d-block rounded" alt="Movie Poster" style="width: 400px; height: 200px" />
                        </div>
                    `;
					rowContainer.append(movieContent);
				});

				// Append the new item to the carousel inner
				const carouselInner = $('#topboxoffice .carousel-inner');
				carouselInner.append(newItem);

				$('#topboxoffice')
					.carousel('dispose')
					.carousel({ interval: false });
			}
		},
		error: function () {
			console.log('Error fetching data');
		},
	});
}

$('.tbo-carousel-next').click(function (event) {
	currentPage++;
	if (currentPage > 6) {
		currentPage = 1;
	}
	updateCarousel(currentPage);
});

$('.tbo-carousel-prev').click(function (event) {
	currentPage--;
	if (currentPage < 1) {
		currentPage = 6;
	}
	updateCarousel(currentPage);
});
