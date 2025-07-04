$(function () {
  const DESIGNS_PER_PAGE = 3;
  let designs = [];
  let categories = [];
  let currentCategory = "All";
  let currentPage = 1;

  // Fetch designs data
  $.getJSON("data/designs.json", function (data) {
    designs = data;
    categories = [
      "All",
      ...Array.from(new Set(designs.map((d) => d.category)))
    ];
    renderTabs();
    renderGrid();
    renderPagination();
  });

  function renderTabs() {
    let html =
      '<ul class="nav nav-tabs mb-4 justify-content-center" id="designsTabsNav" role="tablist">';
    categories.forEach((cat, idx) => {
      html += `<li class="nav-item">
        <a class="nav-link${cat === currentCategory ? " active" : ""}"
           id="${cat.toLowerCase()}-tab"
           data-toggle="tab"
           href="#"
           role="tab"
           aria-controls="${cat.toLowerCase()}"
           aria-selected="${cat === currentCategory ? "true" : "false"}"
           tabindex="${cat === currentCategory ? "0" : "-1"}"
           data-category="${cat}">
          ${cat}
        </a>
      </li>`;
    });
    html += "</ul>";
    $("#designsTabsNav").replaceWith(html);
    // Tab click logic
    $("#designsTabsNav .nav-link")
      .off("click")
      .on("click", function (e) {
        e.preventDefault();
        currentCategory = $(this).data("category");
        currentPage = 1;
        renderTabs();
        renderGrid();
        renderPagination();
      });
  }

  function getFilteredDesigns() {
    if (currentCategory === "All") return designs;
    return designs.filter((d) => d.category === currentCategory);
  }

  function renderGrid() {
    const filtered = getFilteredDesigns();
    const start = (currentPage - 1) * DESIGNS_PER_PAGE;
    const end = start + DESIGNS_PER_PAGE;
    const pageDesigns = filtered.slice(start, end);
    let html = "";
    if (pageDesigns.length === 0) {
      html =
        '<div class="w-100 text-center py-5">No designs found in this category.</div>';
    } else {
      pageDesigns.forEach((d) => {
        html += `<div class="design-card">
          <img src="${d.image}" class="design-card-img" alt="${d.title}" />
          <div class="design-card-body">
            <div class="design-card-title">${d.title}</div>
            <div class="design-card-text">${d.description}</div>
          </div>
        </div>`;
      });
    }
    $("#designs-grid").html(html);
  }

  function renderPagination() {
    const filtered = getFilteredDesigns();
    const totalPages = Math.ceil(filtered.length / DESIGNS_PER_PAGE);
    if (totalPages <= 1) {
      $("#designs-pagination").html("");
      return;
    }
    let html = '<div class="block-27"><ul>';
    html += '<li><a href="#" data-page="prev">&lt;</a></li>';
    for (let i = 1; i <= totalPages; i++) {
      if (i === currentPage) {
        html += `<li class="active"><span>${i}</span></li>`;
      } else {
        html += `<li><a href="#" data-page="${i}">${i}</a></li>`;
      }
    }
    html += '<li><a href="#" data-page="next">&gt;</a></li>';
    html += "</ul></div>";
    $("#designs-pagination").html(html);
    // Disable prev/next if at ends
    if (currentPage === 1)
      $("#designs-pagination ul li:first-child a")
        .addClass("disabled")
        .attr("tabindex", -1);
    if (currentPage === totalPages)
      $("#designs-pagination ul li:last-child a")
        .addClass("disabled")
        .attr("tabindex", -1);
    $("#designs-pagination .page-link, #designs-pagination a").click(function (
      e
    ) {
      e.preventDefault();
      var page = $(this).data("page");
      if (page === "prev" && currentPage > 1) currentPage--;
      else if (page === "next" && currentPage < totalPages) currentPage++;
      else if (typeof page === "number" || !isNaN(parseInt(page)))
        currentPage = parseInt(page);
      renderGrid();
      renderPagination();
      // Scroll to top of grid
      $("html, body").animate(
        { scrollTop: $("#designs-grid").offset().top - 80 },
        300
      );
    });
  }
});
