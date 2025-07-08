// project-tabs.js
$(function () {
  const PROJECTS_PER_PAGE = 6;
  let allProjects = [];
  let currentTab = "all";
  let currentPage = { all: 1, latest: 1, gtb: 1 };
  let tabProjects = {};

  // Utility: Render a project card
  function renderProjectCard(project) {
    return `
      <div class="col-md-4">
        <div class="project">
          <a href="${project.image}" class="img image-popup d-flex align-items-center" style="background-image: url('${project.image}')">
            <div class="icon d-flex align-items-center justify-content-center mb-5">
              <span class="fa fa-plus"></span>
            </div>
          </a>
          <div class="text">
            <span class="subheading">Building</span>
            <h3>${project.title}</h3>
            <p><span class="fa fa-map-marker mr-1"></span> ${project.location}</p>
          </div>
        </div>
      </div>
    `;
  }

  // Utility: Render a tab pane (paginated)
  function renderTabPane(id, projects, active, page) {
    const start = (page - 1) * PROJECTS_PER_PAGE;
    const end = start + PROJECTS_PER_PAGE;
    const paginated = projects.slice(start, end);
    return `
      <div class="tab-pane${
        active ? " show active" : ""
      }" id="${id}" role="tabpanel" aria-labelledby="${id}-tab" aria-hidden="${!active}" tabindex="0" style="display:${active ? "block" : "none"};">
        <div class="row">
          ${paginated.map(renderProjectCard).join("")}
        </div>
      </div>
    `;
  }

  // Utility: Render pagination
  function renderPagination(tab, totalProjects, page) {
    const totalPages = Math.ceil(totalProjects / PROJECTS_PER_PAGE);
    if (totalPages <= 1) return "";
    let html = "<ul>";
    html += `<li><a href="#" data-page="prev">&lt;</a></li>`;
    for (let i = 1; i <= totalPages; i++) {
      if (i === page) {
        html += `<li class="active"><span>${i}</span></li>`;
      } else {
        html += `<li><a href="#" data-page="${i}">${i}</a></li>`;
      }
    }
    html += `<li><a href="#" data-page="next">&gt;</a></li>`;
    html += "</ul>";
    return html;
  }

  // Render all tab panes and pagination
  function renderTabs() {
    const categories = [
      { id: "all", label: "All Projects" },
      { id: "latest", label: "Latest Projects" },
      { id: "gtb", label: "GTB Projects" }
    ];
    let tabContent = "";
    categories.forEach((cat, i) => {
      const projects = tabProjects[cat.id];
      const page = currentPage[cat.id];
      tabContent += renderTabPane(
        cat.id,
        projects,
        currentTab === cat.id,
        page
      );
    });
    $("#projectTabsContent").html(tabContent);
    // Render pagination for current tab
    const total = tabProjects[currentTab].length;
    const page = currentPage[currentTab];
    $(".block-27").html(renderPagination(currentTab, total, page));
  }

  // Fetch and render
  fetch("data/projects.json")
    .then((res) => res.json())
    .then((projects) => {
      allProjects = projects;
      // Categorize
      tabProjects = {
        all: projects,
        latest: projects.filter((p) => p.categories.includes("Latest")),
        gtb: projects.filter((p) => p.categories.includes("GTB"))
      };
      renderTabs();

      // Tab switching logic
      $('#projectTabs a[data-toggle="tab"]')
        .off("click")
        .on("click", function (e) {
          e.preventDefault();
          var target = $(this).attr("href").replace("#", "");
          currentTab = target;
          currentPage[currentTab] = 1;
          renderTabs();
          $("#projectTabs .nav-link")
            .removeClass("active")
            .attr({ "aria-selected": "false", tabindex: "-1" });
          $(this)
            .addClass("active")
            .attr({ "aria-selected": "true", tabindex: "0" });
          $(".tab-pane")
            .hide()
            .removeClass("fade-in")
            .attr("aria-hidden", "true");
          $("#" + currentTab)
            .fadeIn(200)
            .addClass("fade-in")
            .attr("aria-hidden", "false");
        });

      // Pagination click logic
      $(document).on("click", ".block-27 a[data-page]", function (e) {
        e.preventDefault();
        const total = tabProjects[currentTab].length;
        const totalPages = Math.ceil(total / PROJECTS_PER_PAGE);
        let page = currentPage[currentTab];
        const val = $(this).data("page");
        if (val === "prev") {
          if (page > 1) page--;
        } else if (val === "next") {
          if (page < totalPages) page++;
        } else {
          page = parseInt(val);
        }
        if (page !== currentPage[currentTab]) {
          currentPage[currentTab] = page;
          renderTabs();
          $(".tab-pane")
            .hide()
            .removeClass("fade-in")
            .attr("aria-hidden", "true");
          $("#" + currentTab)
            .fadeIn(200)
            .addClass("fade-in")
            .attr("aria-hidden", "false");
        }
      });

      // Keyboard navigation for tabs
      $("#projectTabs .nav-link")
        .off("keydown")
        .on("keydown", function (e) {
          var $tabs = $("#projectTabs .nav-link");
          var idx = $tabs.index(this);
          if (e.which === 37) {
            // left arrow
            var prev = idx === 0 ? $tabs.length - 1 : idx - 1;
            $tabs.eq(prev).focus().click();
          } else if (e.which === 39) {
            // right arrow
            var next = idx === $tabs.length - 1 ? 0 : idx + 1;
            $tabs.eq(next).focus().click();
          }
        });
    });
});
