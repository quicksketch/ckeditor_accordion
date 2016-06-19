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

          $accordion.children('dt:first').addClass('active');
          $accordion.children('dd:first').addClass('active');

          // wrap the accordion in a div element so that quick edit function shows the source correctly
          $accordion.addClass('styled').removeClass('ckeditor-accordion').wrap('<div class="ckeditor-accordion-container"></div>');
        });

        // add click event to body once because quick edits & ajax calls might reset the HTML
        $('body').once('ckeditorAccordionToggleEvent').on('click', '.ckeditor-accordion-container dt', function(e) {
          var $t = $(this);
          var $parent = $t.parent();

          // clicking on open element
          if($t.hasClass('active')) {
            $t.removeClass('active');
            $t.next().slideUp();
          } else {
            $parent.children('dt.active').removeClass('active');
            $parent.children('dd.active').slideUp();

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