// Home Page Logic (index.js)
$(document).ready(function () {
  console.log("Index.js loaded");

  // Load latest blogs for homepage
  function loadLatestBlogs() {
    console.log("loadLatestBlogs function called");

    if (!$("#latest-blogs-section").length) {
      console.log("latest-blogs-section not found");
      return;
    }

    console.log("latest-blogs-section found, loading blogs.json...");

    // Add a loading indicator
    $("#latest-blogs-section").html(
      '<div class="col-12 text-center"><p>Loading latest blogs...</p></div>'
    );

    $.getJSON("data/blogs.json")
      .done(function (blogs) {
        console.log("Blogs loaded successfully:", blogs.length, "blogs found");

        // Get the 3 most recent blogs
        const latestBlogs = blogs.slice(0, 3);
        console.log("Latest blogs:", latestBlogs);

        const blogsHtml = latestBlogs
          .map(function (blog) {
            const blogLink = "blog-single.html?id=" + blog.id;
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
                <h3 class="heading">
                  <a href="${blogLink}">${blog.title}</a>
                </h3>
                <p>${blog.excerpt}</p>
                <p><a href="${blogLink}" class="btn btn-secondary py-2 px-3">Read more</a></p>
              </div>
            </div>
          </div>
        `;
          })
          .join("");

        console.log("Generated HTML:", blogsHtml);
        $("#latest-blogs-section").html(blogsHtml);
        console.log("HTML inserted into latest-blogs-section");

        // Animate the blog entries
        setTimeout(function () {
          $(".ftco-animate").addClass("fadeInUp ftco-animated");
        }, 100);
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.error("Failed to load blogs:", textStatus, errorThrown);
        console.error("Response:", jqXHR.responseText);

        // Fallback content if AJAX fails
        $("#latest-blogs-section").html(`
        <div class="col-lg-4 ftco-animate">
          <div class="blog-entry">
            <a href="blog-single.html?id=1" class="block-20" style="background-image: url('images/Construction_workers_in_Lagos,Nigeria_02.jpg')"></a>
            <div class="text d-block">
              <div class="meta">
                <p>
                  <a href="#"><span class="fa fa-calendar mr-2"></span>Sept. 06, 2020</a>
                  <a href="#"><span class="fa fa-user mr-2"></span>Admin</a>
                  <a href="#" class="meta-chat"><span class="fa fa-comment mr-2"></span> 3</a>
                </p>
              </div>
              <h3 class="heading">
                <a href="blog-single.html?id=1">Best for any industrial & business solution</a>
              </h3>
              <p>In Lagos, Nigeria's commercial capital, innovative construction teams are using modern equipment to deliver industrial solutions that power the city's rapid growth.</p>
              <p><a href="blog-single.html?id=1" class="btn btn-secondary py-2 px-3">Read more</a></p>
            </div>
          </div>
        </div>
        <div class="col-lg-4 ftco-animate">
          <div class="blog-entry">
            <a href="blog-single.html?id=2" class="block-20" style="background-image: url('images/Internal_remodelling2.jpg')"></a>
            <div class="text d-block">
              <div class="meta">
                <p>
                  <a href="#"><span class="fa fa-calendar mr-2"></span>Sept. 06, 2020</a>
                  <a href="#"><span class="fa fa-user mr-2"></span>Admin</a>
                  <a href="#" class="meta-chat"><span class="fa fa-comment mr-2"></span> 3</a>
                </p>
              </div>
              <h3 class="heading">
                <a href="blog-single.html?id=2">How to choose the right contractor</a>
              </h3>
              <p>In Abuja, selecting a contractor with local experience is key. The image shows a recent interior remodel in Wuse, highlighting the value of skilled, certified professionals.</p>
              <p><a href="blog-single.html?id=2" class="btn btn-secondary py-2 px-3">Read more</a></p>
            </div>
          </div>
        </div>
        <div class="col-lg-4 ftco-animate">
          <div class="blog-entry">
            <a href="blog-single.html?id=3" class="block-20" style="background-image: url('images/Steel_fabrications2.jpg')"></a>
            <div class="text d-block">
              <div class="meta">
                <p>
                  <a href="#"><span class="fa fa-calendar mr-2"></span>Sept. 06, 2020</a>
                  <a href="#"><span class="fa fa-user mr-2"></span>Admin</a>
                  <a href="#" class="meta-chat"><span class="fa fa-comment mr-2"></span> 3</a>
                </p>
              </div>
              <h3 class="heading">
                <a href="blog-single.html?id=3">Modern construction trends in 2020</a>
              </h3>
              <p>Port Harcourt is embracing steel fabrication and modular design, setting the pace for modern construction trends across southern Nigeria.</p>
              <p><a href="blog-single.html?id=3" class="btn btn-secondary py-2 px-3">Read more</a></p>
            </div>
          </div>
        </div>
      `);
      });
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

  // Load latest blogs
  loadLatestBlogs();
});
