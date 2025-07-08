// Blog Single Page Logic (blog-single.js)
$(document).ready(function () {
  // Only run on blog-single.html
  if ($(".ftco-animate").length === 0) return;

  // Helper: Get query param
  function getQueryParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
  }

  // Helper: Format date
  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit"
    });
  }

  // Helper: Render recent blog sidebar item
  function renderRecentBlogItem(blog) {
    const blogLink = "blog-single.html?id=" + blog.id;
    return `
      <div class="block-21 mb-4 d-flex">
        <a class="blog-img mr-4" style="background-image: url(${
          blog.image
        })"></a>
        <div class="text">
          <h3 class="heading">
            <a href="${blogLink}">${blog.title}</a>
          </h3>
          <div class="meta">
            <div>
              <a href="#"><span class="icon-calendar"></span> ${formatDate(
                blog.date
              )}</a>
            </div>
            <div>
              <a href="#"><span class="icon-person"></span> ${blog.author}</a>
            </div>
            <div>
              <a href="#"><span class="icon-chat"></span> ${blog.comments}</a>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Main logic
  const blogId = getQueryParam("id");
  if (!blogId) return;

  $.getJSON("data/blogs.json").done(function (blogs) {
    const blog = blogs.find((b) => String(b.id) === String(blogId));
    if (!blog) return;

    // Replace title
    $(".ftco-animate h2.mb-3").first().text(blog.title);
    // Replace excerpt/intro
    $(".ftco-animate p").first().text(blog.excerpt);
    // Replace all main images
    $(".ftco-animate img.img-fluid").attr("src", blog.image);
    // Replace meta (date, author, comments)
    const metaHtml = `
        <a href="#"><span class="fa fa-calendar mr-2"></span>${formatDate(
          blog.date
        )}</a>
        <a href="#"><span class="fa fa-user mr-2"></span>${blog.author}</a>
        <a href="#" class="meta-chat"><span class="fa fa-comment mr-2"></span> ${
          blog.comments
        }</a>
      `;
    $(".ftco-animate .meta p").html(metaHtml);

    // Load recent blogs sidebar (exclude current blog)
    const recentBlogs = blogs
      .filter((b) => String(b.id) !== String(blogId))
      .slice(0, 3); // Show only 3 recent blogs

    const recentBlogsHtml = recentBlogs.map(renderRecentBlogItem).join("");
    $("#recent-blogs-sidebar").html(recentBlogsHtml);
  });
});
