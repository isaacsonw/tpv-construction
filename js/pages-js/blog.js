// Blog Search & Pagination (blog.js)
$(document).ready(function () {
  if (!$("#blog-list").length) return;

  var blogs = [];
  var filteredBlogs = [];
  var blogsPerPage = 6;
  var currentPage = 1;

  function renderBlogCard(blog) {
    var blogLink = "blog-single.html?id=" + blog.id;
    return `
      <div class="col-lg-4 ftco-animate">
        <div class="blog-entry">
          <a href="${blogLink}" class="block-20" style="background-image: url('${blog.image}')"></a>
          <div class="text d-block">
            <div class="meta">
              <p>
                <a href="#"><span class="fa fa-calendar mr-2"></span>${formatDate(
                  blog.date
                )}</a>
                <a href="#"><span class="fa fa-user mr-2"></span>${
                  blog.author
                }</a>
                <a href="#" class="meta-chat"><span class="fa fa-comment mr-2"></span> ${
                  blog.comments
                }</a>
              </p>
            </div>
            <h3 class="heading"><a href="${blogLink}">${blog.title}</a></h3>
            <p>${blog.excerpt}</p>
            <p><a href="${blogLink}" class="btn btn-secondary py-2 px-3">Read more</a></p>
          </div>
        </div>
      </div>
    `;
  }

  function formatDate(dateStr) {
    var d = new Date(dateStr);
    var opts = { year: "numeric", month: "short", day: "2-digit" };
    return d.toLocaleDateString("en-US", opts);
  }

  function renderBlogsPage(page) {
    var start = (page - 1) * blogsPerPage;
    var end = start + blogsPerPage;
    var pageBlogs = filteredBlogs.slice(start, end);
    var html = pageBlogs.map(renderBlogCard).join("");
    $("#blog-list").html(html);
    // Animate
    setTimeout(function () {
      $(".ftco-animate").addClass("fadeInUp ftco-animated");
    }, 100);
  }

  function renderPagination() {
    var totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
    var html = "";
    html += '<li><a href="#" data-page="prev">&lt;</a></li>';
    for (var i = 1; i <= totalPages; i++) {
      if (i === currentPage) {
        html += '<li class="active"><span>' + i + "</span></li>";
      } else {
        html += '<li><a href="#" data-page="' + i + '">' + i + "</a></li>";
      }
    }
    html += '<li><a href="#" data-page="next">&gt;</a></li>';
    $(".block-27 ul").html(html);
    // Disable prev/next if at ends
    if (currentPage === 1)
      $(".block-27 ul li:first-child a")
        .addClass("disabled")
        .attr("tabindex", -1);
    if (currentPage === totalPages)
      $(".block-27 ul li:last-child a")
        .addClass("disabled")
        .attr("tabindex", -1);
  }

  function updateBlogs() {
    renderBlogsPage(currentPage);
    renderPagination();
  }

  function filterBlogs(query) {
    query = query.trim().toLowerCase();
    if (!query) {
      filteredBlogs = blogs.slice();
    } else {
      filteredBlogs = blogs.filter(function (blog) {
        return (
          blog.title.toLowerCase().includes(query) ||
          blog.excerpt.toLowerCase().includes(query) ||
          blog.categories.join(" ").toLowerCase().includes(query)
        );
      });
    }
    currentPage = 1;
    updateBlogs();
  }

  // Event: Pagination click
  $(document).on("click", ".block-27 ul a:not(.disabled)", function (e) {
    e.preventDefault();
    var page = $(this).data("page");
    var totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
    if (page === "prev" && currentPage > 1) currentPage--;
    else if (page === "next" && currentPage < totalPages) currentPage++;
    else if (typeof page === "number" || !isNaN(parseInt(page)))
      currentPage = parseInt(page);
    updateBlogs();
    // Scroll to top of blog list
    $("html, body").animate(
      { scrollTop: $("#blog-list").offset().top - 80 },
      300
    );
  });

  // Event: Search
  var blogSearchDebounceTimer = null;
  $("#blog-search-form").on("submit", function (e) {
    e.preventDefault();
    var q = $("#blog-search-input").val();
    filterBlogs(q);
  });
  $("#blog-search-input").on("input", function () {
    var q = $(this).val();
    if (blogSearchDebounceTimer) clearTimeout(blogSearchDebounceTimer);
    blogSearchDebounceTimer = setTimeout(function () {
      filterBlogs(q);
    }, 1000);
  });

  // Keyboard navigation for pagination
  $(document).on("keydown", ".block-27 ul a", function (e) {
    if (e.key === "ArrowRight") $(this).parent().next().find("a").focus();
    if (e.key === "ArrowLeft") $(this).parent().prev().find("a").focus();
  });

  // Load blogs
  $.getJSON("data/blogs.json").done(function (data) {
    blogs = data;
    filteredBlogs = blogs.slice();
    updateBlogs();
  });
});
