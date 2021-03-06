/*!
 * LCH media jQuery plugin
 * Handles all stuff related to medias in SF bundle
 */
(function( $ ) {

  var mediaSelectorContainer = 'media-selector-container';
  var idModal = 'image-modal__';
  // var idModalSave = 'image-modal-save__';
  var inputName = 'image__';
  var thumbName = 'imageThumb__';

  var methods = {
    /**
     * Init plugin
     * @param options
     */
    init: function (options) {

      return this;
    },
    /**
     * Renew random ID on media selector widget
     */
    renewRandomId: function () {
      // var this = element.find('.media-selector-container');
      var oldRandomId = this.attr('data-random');
      var newRandomId = Math.floor(100000000 + Math.random() * 900000000);

      // Update IDs
      this.find("[id$='" + oldRandomId + "']").each(function () {
        var rootId = $(this).attr('id').split('__')[0];
        $(this).attr('id', rootId + "__" + newRandomId);
      });

      // Update hrefs
      this.find("a[href$='" + oldRandomId + "']").each(function () {
        var rootId = $(this).attr('href').split('__')[0];
        $(this).attr('href', rootId + "__" + newRandomId);
      });

      // then change the data-random
      this.attr('data-random', newRandomId);

      // then change data-target button
      $('[data-target$="' + oldRandomId + '"]').attr('data-target', "#image-modal__" + newRandomId);
    },

    /**
     * Dynamic attach event bindings to item loaded with isotope
     * @param $modal the modal object containing list
     */
    attachMediaItemHandlers: function ($modal) {
      randId = extractRandId($modal.attr('id'));
      attachMediaItemHandlers($modal, this, randId);
    }
  };

  /**********************************************
   * Private methods
   */

  /**
   * On media modal show
   */
  $('body')
      .on('show.bs.modal', 'div[id^=' + idModal + ']', function (e) {
        var id = $(this).attr('id');
        var randId = extractRandId(id);
        var addRoute = $(this).attr('data-route-add');
        var mediaType = $(this).attr('data-media-type');
        loadAddMediaForm(randId, addRoute, mediaType);
      })
      .on('shown.bs.tab', 'div[id^=' + idModal + '] a[data-toggle="tab"]', function (e) {
        var $parentModal = $(this).parents('div[id^=' + idModal + ']');
        var id = $parentModal.attr('id');
        var randId = extractRandId(id);
        var listRoute = $parentModal.attr('data-route-list');
        var mediaType = $parentModal.attr('data-media-type');

        if (e.target.hash == "#list-media__" + randId) {
          loadListMediaForm(randId, listRoute, mediaType);

          // // Relayout istope
          // $parentModal.isotope('reLayout');
        }
      })
      .on('click', 'button.remove-media-association', function (e) {
        e.preventDefault();
        var $parentMediaContainer = $(this).closest('.' + mediaSelectorContainer);
        var $input = $parentMediaContainer.find('input[type=hidden]');

        // Remove attribute
        $input.removeAttr('value');
        $parentMediaContainer.find('.thumbnail-container').html("");
        $parentMediaContainer.find('button.remove-media-association, button.choose-media, button.edit-media')
            .toggleClass('d-none')
        ;
      })
  ;

  /**
   * Load the add Media Form in the modal
   *
   * @param randId
   * @param addRoute
   * @param mediaType
   */
  function loadAddMediaForm(randId, addRoute, mediaType) {
    var $modal = $('#' + idModal + randId);
    var fileValue;
    var data = {'id': $('div[id="' + inputName + randId + '"] input[type=hidden]').val()};

    // Load addition route by default
    jQuery.ajax({
      url: Routing.generate(addRoute, {'type': mediaType}),
      type: 'POST',
      data: data,
      success: function (html) {
        var formName = $(html).attr('name');

        $modal.find('div.modal-body #add-media__' + randId).empty();
        $modal.find('div.modal-body #add-media__' + randId).append(
            html
        );

        // Set file helper
        $('div#' + idModal + randId + ' p.fileHelper').html($('#' + inputName + randId).find('input[type=hidden]').attr('data-helper'));

        // TODO review extension check
        // var $fileError = $('#'+idModal+randId + ' #fileError');
        $('div#' + idModal + randId + ' #lch_media_bundle_image_file').on('change', function () {
          //
          //     fileValue = $(this).val();
          //
          //     // Remove Path form the filename
          //     var fileValueTpm = fileValue.split('\\');
          //     fileValue = fileValueTpm[fileValueTpm.length -1];
          //
          //     // Remove file extension form the filename
          //     fileValueTpm = fileValue.split('.');
          //
          //     // store file extension
          //     var fileExtension = fileValueTpm.pop();
          //
          //     fileValue = fileValueTpm.join('.');
          //
          //     var $hiddenInput = $('#image-'+randId).find('input[type=hidden]');
          //
          //     // Clean file Errors
          //     $fileError.empty();
          //
          //     // Control file extension
          //     var attrDataFormat = $hiddenInput.attr('data-format');
          //     if (typeof attrDataFormat !== typeof undefined && attrDataFormat !== false) {
          //         var allowedFormat = attrDataFormat.split(',');
          //         if (allowedFormat.indexOf(fileExtension) == -1) {
          //             $fileError.append("<p>Le fichier doit être au format <strong>"+$hiddenInput.attr('data-format')+'</strong></p>');
          //             $('div#'+idModal+randId+' #lch_media_bundle_image_file').val('');
          //         }
          //     }
          // TODO review limit checks
          //     var file = this.files[0];
          //     if( file ) {
          //         var img = new Media();
          //
          //         img.src = window.URL.createObjectURL( file );
          //
          //         img.onload = function() {
          //             var width = img.naturalWidth,
          //                 height = img.naturalHeight;
          //             window.URL.revokeObjectURL( img.src );
          //
          //
          //             // Control minimum width
          //             var minWidth = $hiddenInput.attr('data-min_width');
          //             if (typeof minWidth !== typeof undefined && minWidth !== false) {
          //                 if (minWidth > width) {
          //                     $fileError.append("<p>Le fichier doit avoir une largeur supérieur à <strong>" + minWidth + ' px</strong></p>');
          //                 }
          //             }
          //             // Control maximum width
          //             var maxWidth = $hiddenInput.attr('data-max_width');
          //             if (typeof maxWidth !== typeof undefined && maxWidth !== false) {
          //                 if (maxWidth < width) {
          //                     $fileError.append("<p>Le fichier doit avoir une largeur inférieur à <strong>" + maxWidth + ' px</strong></p>');
          //                 }
          //             }
          //
          //             // Control minimum height
          //             var minHeight = $hiddenInput.attr('data-min_height');
          //             if (typeof minHeight !== typeof undefined && minHeight !== false) {
          //                 if (minHeight > height) {
          //                     $fileError.append("<p>Le fichier doit avoir une hauteur supérieur à <strong>" + minHeight + ' px</strong></p>');
          //                 }
          //             }
          //
          //             // Control maximum height
          //             var maxHeight = $hiddenInput.attr('data-max_height');
          //             if (typeof maxHeight !== typeof undefined && maxHeight !== false) {
          //                 if (maxHeight < height) {
          //                     $fileError.append("<p>Le fichier doit avoir une hauteur inférieur à <strong>" + maxHeight + ' px</strong></p>');
          //                 }
          //             }
          //
          //             if ($.trim($fileError.html())=='') {
          //                 var $fileAlt = $('div#'+idModal+randId+' #lch_media_bundle_image_alt');
          //                 if ($fileAlt.val() == '') {
          //                     $fileAlt.attr('value',fileValue);
          //                 }
          //
          //                 var $fileName = $('div#'+idModal+randId+' #lch_media_bundle_image_name');
          //                 if ($fileName.val() == '') {
          //                     $fileName.attr('value',fileValue);
          //                 }
          //             } else {
          //                 $('div#'+idModal+randId+' #lch_media_bundle_image_file').val('');
          //             }
          //         };
          //     }
        });

        // TODO find a way to make it work even if there was problem on first load
        $('form[name=' + formName + ']').on('submit', function (e) {
          e.preventDefault();
          // Add loader in button
          var $button = $(this).find('[type="submit"]');
          var $loader = $('img.loader.d-none').first();
          $loader.removeClass('d-none');
          $button.find('i').remove();
          $button.prepend($loader);

          var formData = new FormData($(this)[0]);

          jQuery.ajax({
            url: $(html).attr('action'),
            type: 'POST',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function (result) {
              if (result instanceof Object && "success" in result) {
                setChosenMedia(result, randId);
                $modal.modal('toggle');
              }
              else {
                $modal.find('div.modal-body #add-media__' + randId)
                    .empty()
                    .html(result)
                ;
              }

            },
            error: function (xhr, status, error) {
              // $modal.find('div.modal-body').empty();
              // $modal.find('div.modal-body').html(
              //     xhr.responseText
              // );
            }
          });
          return false;
        })
      }
    });
  }


  /**
   * Load the add Media Form in the modal
   *
   * @param randId
   * @param listRoute
   * @param mediaType
   * @param page
   */
  function loadListMediaForm(randId, listRoute, mediaType) {
    var $modal = $('#' + idModal + randId);
    var $listTab = $modal.find('div.modal-body #list-media__' + randId);
    // var fileValue;

    // Load list route
    jQuery.ajax({
      url: Routing.generate(listRoute, {type: mediaType}),
      type: 'GET',
      success: function (html) {
        // var formName = $(html).attr('name');

        $listTab.empty();
        $listTab.append(
            html
        );

        // if (!$listTab.find('.media-list').hasClass('isotope')) {
        // Isotope presentation
        $listTab.find('.media-list').isotope({
          itemSelector: '.media',
          percentPosition: true,
          masonry: {
            // use outer width of grid-sizer for columnWidth
            columnWidth: '.media'
          }
        });
        // }
        attachMediaItemHandlers($modal, $listTab, randId);
      }
    });
  }


  function attachMediaItemHandlers($modal, $container, randId) {

    // Handle media selection in list
    $container.find("div.media").on('click', function (e) {
      $container.find("div.media").removeClass('chosen');
      $(this).addClass('chosen');
    });

    $container.find("div.media").dblclick(function () {
      var $chosen = $container.find("div.media.chosen");
      var entity = {
        id: $chosen.attr('data-id'),
        // url: $chosen.attr('data-url'),
        thumbnail: $chosen.html(),
        name: $chosen.attr('data-name'),
      };
      setChosenMedia(entity, randId);
      $modal.modal('toggle');
    });

    // Handle media final choosing
    $container.find("button.select[type='submit']").on('click', function (e) {
      e.preventDefault();
      var $chosen = $container.find("div.media.chosen");
      var entity = {
        id: $chosen.attr('data-id'),
        // url: $chosen.attr('data-url'),
        thumbnail: $chosen.html(),
        name: $chosen.attr('data-name'),
      };
      setChosenMedia(entity, randId);
      $modal.modal('toggle');
    });
  }

  /**
   * Handle media type filling when chosen
   * @param entity
   * @param randId
   */
  function setChosenMedia(entity, randId) {
    var $mediaControl = $('div[id="'+inputName+randId+'"]');
    $mediaControl.find('input[type=hidden]').val(entity.id);
    var thumbId = thumbName + randId;
    // var thumbSelector = "div#" + thumbId;
    $mediaControl.find("div.thumbnail-container").html(entity.thumbnail);
    $mediaControl.find('p[id^=display]').text(entity.name);
  }

  /**
   * Extract the random id generated
   *
   * @param string
   * @returns {*}
   */
  function extractRandId(string)
  {
    var numberPattern = /\d+/g;
    return string.match( numberPattern )[0];
  }

  function resetFormElement(e) {
    e.wrap('<form>').closest('form').get(0).reset();
    e.unwrap();
  }


    $.fn.lchMedia = function(methodOrOptions) {
        if ( methods[methodOrOptions] ) {
            return methods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
            // Default to "init"
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  methodOrOptions + ' does not exist on Jquery LCH Media plugin' );
        }
    };


})( jQuery );