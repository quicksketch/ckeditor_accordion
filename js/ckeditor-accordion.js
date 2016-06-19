(function ($) {
  Drupal.behaviors.ckeditorAccordion = {
    attach: function (context, settings) {
      // create accordion functionality if the required elements exist is available
      var $ckeditorAccordion = $('.ckeditor-accordion');
      if($ckeditorAccordion.length > 0) {
        // create simple accordion mechanism for each tab
        $ckeditorAccordion.each(function() {
          var $accordion = $(this);
          if($accordion.hasClass('styled')) {
            return;
          }

          // the first one is the correct one
          $accordion.children('dt:first').addClass('active');
          $accordion.children('dd:first').addClass('active');

          // turn the accordion tabs to links so that the content is accessible & can be traversed using keyboard
          $accordion.children('dt').each(function() {
            var $tab = $(this);
            var tabText = $tab.text().trim();
            var toggleClass = $tab.hasClass('active') ? ' active' : '';
            $tab.html('<span class="ckeditor-accordion-toggle'+toggleClass+'"></span><a class="ckeditor-accordion-toggler" href="#">'+tabText+'</a>');
          });

          // wrap the accordion in a div element so that quick edit function shows the source correctly
          $accordion.addClass('styled').removeClass('ckeditor-accordion').wrap('<div class="ckeditor-accordion-container"></div>');
        });

        // add click event to body once because quick edits & ajax calls might reset the HTML
        $('body').once('ckeditorAccordionToggleEvent').on('click', '.ckeditor-accordion-toggler', function(e) {
          var $t = $(this).parent();
          var $parent = $t.parent();

          // clicking on open element, close it
          if($t.hasClass('active')) {
            $t.removeClass('active');
            $t.next().slideUp();
          } else {
            // remove active classes
            $parent.children('dt.active').removeClass('active').children('a').removeClass('active');
            $parent.children('dd.active').slideUp(function() {
              $(this).removeClass('active');
            });

            // show the selected tab
            $t.addClass('active');
            $t.next().slideDown(300).addClass('active');
          }

          // don't add hash to url
          e.preventDefault();
        });
      }
    }
  }
})(jQuery);