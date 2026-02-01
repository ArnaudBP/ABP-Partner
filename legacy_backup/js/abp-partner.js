// abp-partner.js
var abppartner = {
    RATIOSLIDE:3,
    INTERVALSLIDE : 5000,
    init: function(){
        var that=this;
        that.slide();
    },
    slide : function(){
        var that=this;
        var $cnt = $('.cnt-slide');
        var $imgs = $('.cnt-slide').find('img');
        
        if( $cnt.length ) {
            $cnt.height( $cnt.width() / that.RATIOSLIDE );
            $( window ).load(function() {
                $imgs.removeClass('invisible');
                $cnt.fadeSlideShow({
                    width: $cnt.width(), // default width of the slideshow
                    height: $cnt.height(),
                    PlayPauseElement:false,
                    NextElement:false,
                    PrevElement:false ,
                    ListElement:false,
                    interval: that.INTERVALSLIDE,
                });
            });
            
        }
        
        
    }
};
