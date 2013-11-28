define(function(require){

    var $self = {};


    $self.draw = function(args){
        var $div = $("<div>");

        $div.text("blub");

        return $div;
    }


    $self.redraw = function(args, $el, state){
        $el.text = "test";

    }

    $self.getModMeta = function(args){
        return {
            "name": "Score"
        }
    };


    return $self;


});