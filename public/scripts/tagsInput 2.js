$(document).ready(function(){
    const providedTags = [];
    var $input = $(".tags__provider input"),
        $appendHere = $(".tagHere"),
        $actualTags = [],
        oldKey = 0, newKey,
        SPACEKEY = 32;
    $input.focus();
    
    $input.keydown(function(e){
    
      if(e.keyCode == SPACEKEY) {
        if(e.preventDefault) {
          e.preventDefault();
          if($(this).val() == '' || $(this).val() == ' ') {
            return false;
          }
          addTag($(this));
        }
        return false;
      }
      
      if($(this).val() == '' && e.keyCode === 8) {
        $(".tag:last-child").remove();
        $actualTags.pop();
      }
      
    })
    
    function addTag(element) {
      var $tag = $("<div />"), $a = $("<a href='#' />"), $span = $("<span />");
      $tag.addClass('tag');
      $('<i class="fa fa-times" aria-hidden="true"></i>').appendTo($a);
      $span.text($(element).val());
      $a.bind('click', function(){
        $(this).parent().remove();
        let deletedElement = $(this).parent()[0].innerText;
        let positionOfEl = $actualTags.indexOf(deletedElement);
        $actualTags.splice(positionOfEl, 1);
        $(this).unbind('click');
      });

      $a.appendTo($tag);
      $span.appendTo($tag);
      $tag.appendTo($appendHere);
      $(element).val('');
      $actualTags.push($tag[0].innerText);
      providedTags.push($(element).val());
    }

    $('#tags__submit').on('click', function(e){
      $('.tags__provided').attr('value', $actualTags);
    })
  });