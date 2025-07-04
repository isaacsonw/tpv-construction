$(document).ready(function () {
  // Load team data
  loadTeamData();
});

function loadTeamData() {
  // Clear any existing content first
  const teamContainer = $("#team-container");
  teamContainer.empty();

  $.ajax({
    url: "data/team.json",
    type: "GET",
    dataType: "json",
    success: function (data) {
      renderTeamMembers(data);
    },
    error: function (xhr, status, error) {
      console.error("Error loading team data:", error);
      console.error("Status:", status);
      console.error("Response:", xhr.responseText);
      // Fallback to static content if JSON loading fails
      showFallbackTeamContent();
    }
  });
}

function renderTeamMembers(teamData) {
  const teamContainer = $("#team-container");

  if (teamContainer.length === 0) {
    console.error("Team container not found");
    return;
  }

  let teamHTML = "";

  teamData.forEach(function (member) {
    teamHTML += `
            <div class="col-lg-4 col-sm-6">
                <div class="block-2 ftco-animate">
                    <div class="flipper">
                        <div class="front" style="background-image: url(${member.image})">
                            <div class="box">
                                <h2>${member.name}</h2>
                                <p>${member.position}</p>
                            </div>
                        </div>
                        <div class="back">
                            <blockquote>
                                <p>&ldquo;${member.quote}&rdquo;</p>
                            </blockquote>
                            <div class="author d-flex">
                                <div class="image align-self-center">
                                    <img src="${member.image}" alt="${member.name}" />
                                </div>
                                <div class="name align-self-center ml-3">
                                    ${member.name}
                                    <span class="position">${member.position}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
  });

  teamContainer.html(teamHTML);
}

function showFallbackTeamContent() {
  const teamContainer = $("#team-container");

  if (teamContainer.length === 0) {
    console.error("Team container not found");
    return;
  }

  // Fallback static content
  const fallbackHTML = `
        <div class="col-lg-4 col-sm-6">
            <div class="block-2 ftco-animate">
                <div class="flipper">
                    <div class="front" style="background-image: url(images/person_1.jpg)">
                        <div class="box">
                            <h2>Emeka Okonkwo</h2>
                            <p>Senior Project Manager</p>
                        </div>
                    </div>
                    <div class="back">
                        <blockquote>
                            <p>&ldquo;At TPV Construction, we believe in delivering excellence in every project. Our commitment to quality and attention to detail ensures that every client receives the best possible outcome.&rdquo;</p>
                        </blockquote>
                        <div class="author d-flex">
                            <div class="image align-self-center">
                                <img src="images/person_1.jpg" alt="Emeka Okonkwo" />
                            </div>
                            <div class="name align-self-center ml-3">
                                Emeka Okonkwo
                                <span class="position">Senior Project Manager</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-lg-4 col-sm-6">
            <div class="block-2 ftco-animate">
                <div class="flipper">
                    <div class="front" style="background-image: url(images/person_2.jpg)">
                        <div class="box">
                            <h2>Fatima Bello</h2>
                            <p>Chief Engineer</p>
                        </div>
                    </div>
                    <div class="back">
                        <blockquote>
                            <p>&ldquo;Our engineering team combines technical expertise with innovative solutions to deliver projects that meet the highest standards of safety and quality.&rdquo;</p>
                        </blockquote>
                        <div class="author d-flex">
                            <div class="image align-self-center">
                                <img src="images/person_2.jpg" alt="Fatima Bello" />
                            </div>
                            <div class="name align-self-center ml-3">
                                Fatima Bello
                                <span class="position">Chief Engineer</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-lg-4 col-sm-6">
            <div class="block-2 ftco-animate">
                <div class="flipper">
                    <div class="front" style="background-image: url(images/person_3.jpg)">
                        <div class="box">
                            <h2>Kemi Adebayo</h2>
                            <p>Senior Architect</p>
                        </div>
                    </div>
                    <div class="back">
                        <blockquote>
                            <p>&ldquo;We create architectural designs that blend modern aesthetics with functional excellence, ensuring every space serves its purpose beautifully.&rdquo;</p>
                        </blockquote>
                        <div class="author d-flex">
                            <div class="image align-self-center">
                                <img src="images/person_3.jpg" alt="Kemi Adebayo" />
                            </div>
                            <div class="name align-self-center ml-3">
                                Kemi Adebayo
                                <span class="position">Senior Architect</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

  teamContainer.html(fallbackHTML);
}
