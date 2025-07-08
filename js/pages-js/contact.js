// Contact Page Logic (contact.js)
$(document).ready(function () {
  if (!$("#address-slider-track").length && !$(".contact-form").length) return;

  // Dynamic Address Card Loader
  function renderAddressCards(addresses) {
    var html = "";
    addresses.forEach(function (addr, i) {
      html += `
        <div class="dbox w-100 d-flex ftco-animate flex-column align-items-center justify-content-center mx-2${
          i === 0 ? " active" : ""
        }"
          data-lat="${addr.lat}" data-lng="${addr.lng}" aria-label="${
        addr.name
      }, ${addr.address}">
          <div class="icon d-flex align-items-center justify-content-center mb-2 mx-auto">
            <span class="fa fa-map-marker address-icon"></span>
          </div>
          <div class="text">
            <p><span class="office-title">${addr.name}:</span> ${
        addr.address
      }</p>
            <div class="d-flex align-items-center justify-content-center mb-2">
              <span class="fa fa-phone phone-icon mr-2"></span><span class="contact-detail">${
                addr.phone
              }</span>
            </div>
            <div class="d-flex align-items-center justify-content-center">
              <span class="fa fa-paper-plane email-icon mr-2"></span><span class="contact-detail">${
                addr.email
              }</span>
            </div>
          </div>
        </div>
      `;
    });
    $("#address-slider-track").html(html);
  }

  // Load addresses and render cards
  $.getJSON("data/addresses.json")
    .done(function (addresses) {
      renderAddressCards(addresses);
      setTimeout(function () {
        // Enhanced Address Slider Functionality
        var $slider = $(".address-slider .slider-track");
        var $cards = $slider.find(".dbox");
        var $left = $(".address-slider .left-arrow");
        var $right = $(".address-slider .right-arrow");
        var cardWidth = $cards.outerWidth(true);
        var current = 0;
        var total = $cards.length;
        function updateSlider(newIndex, smooth) {
          if (newIndex < 0) newIndex = 0;
          if (newIndex > total - 1) newIndex = total - 1;
          current = newIndex;
          var scrollTo =
            $cards.eq(current).position().left +
            $slider.scrollLeft() -
            ($slider.width() - cardWidth) / 2;
          $slider.animate({ scrollLeft: scrollTo }, smooth ? 400 : 0);
          $cards.removeClass("active").attr("tabindex", "-1");
          $cards.eq(current).addClass("active").attr("tabindex", "0").focus();
          $left.prop("disabled", current === 0);
          $right.prop("disabled", current === total - 1);
          updateMapForCard($cards.eq(current));
        }
        $left.off("click").on("click", function () {
          updateSlider(current - 1, true);
        });
        $right.off("click").on("click", function () {
          updateSlider(current + 1, true);
        });
        $cards.off("click").on("click", function () {
          updateSlider($(this).index(), true);
        });
        $slider
          .attr("tabindex", "0")
          .off("keydown")
          .on("keydown", function (e) {
            if (e.key === "ArrowLeft") updateSlider(current - 1, true);
            if (e.key === "ArrowRight") updateSlider(current + 1, true);
          });
        var startX, scrollStart;
        $slider.off("touchstart").on("touchstart", function (e) {
          startX = e.originalEvent.touches[0].pageX;
          scrollStart = $slider.scrollLeft();
        });
        $slider.off("touchmove").on("touchmove", function (e) {
          var dx = e.originalEvent.touches[0].pageX - startX;
          $slider.scrollLeft(scrollStart - dx);
        });
        $slider.off("touchend").on("touchend", function () {
          var idx = 0,
            minDist = Infinity,
            sliderCenter = $slider.scrollLeft() + $slider.width() / 2;
          $cards.each(function (i) {
            var cardCenter = $(this).position().left + $(this).outerWidth() / 2;
            var dist = Math.abs(cardCenter - sliderCenter);
            if (dist < minDist) {
              minDist = dist;
              idx = i;
            }
          });
          updateSlider(idx, true);
        });
        updateSlider(0, false);
        function updateMapForCard($card) {
          var lat = $card.data("lat");
          var lng = $card.data("lng");
          var $map = $('iframe[src*="google.com/maps"]');
          if (!lat || !lng || !$map.length) return;
          if ($("#map-loading").length === 0) {
            $map.before(
              '<div id="map-loading" style="position:absolute;left:0;top:0;width:100%;height:100%;background:rgba(255,255,255,0.7);z-index:10;display:flex;align-items:center;justify-content:center;"><span class="fa fa-spinner fa-spin fa-2x"></span></div>'
            );
          }
          var newSrc =
            "https://www.google.com/maps?q=" +
            lat +
            "," +
            lng +
            "&z=15&output=embed";
          $map.attr("src", newSrc);
          setTimeout(function () {
            $("#map-loading").fadeOut(300, function () {
              $(this).remove();
            });
          }, 1200);
        }
      }, 0);
    })
    .fail(function (jqxhr, textStatus, error) {
      var err = textStatus + ", " + error;
      console.error("[AddressSlider] Failed to load JSON:", err);
    });

  // Contact Form Real-time Validation
  var $form = $(".contact-form");
  $form.find("input, textarea").on("input blur", function () {
    var $field = $(this);
    var valid = true;
    if ($field.prop("required")) {
      if ($field.is('[type="email"]')) {
        valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test($field.val());
      } else {
        valid = $field.val().trim().length > 0;
      }
    }
    $field.toggleClass("is-invalid", !valid);
    $field.toggleClass("is-valid", valid);
  });
  $form.on("submit", function (e) {
    var valid = true;
    $form.find("input, textarea").each(function () {
      var $field = $(this);
      if ($field.prop("required")) {
        if ($field.is('[type="email"]')) {
          if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test($field.val())) valid = false;
        } else {
          if ($field.val().trim().length === 0) valid = false;
        }
      }
      $field.trigger("input");
    });
    if (!valid) {
      e.preventDefault();
      $form.find(".is-invalid:first").focus();
    } else {
      // Show success feedback (customize as needed)
      alert("Thank you for contacting us!");
    }
  });
  // Auto-focus first input
  $form.find("input, textarea").filter(":visible:first").focus();
});
