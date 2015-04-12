var backgroundOpacity = 0;
var lastOpacity = backgroundOpacity;
var infoDirection = ["up","down","right","left"];

var currentDirection = "right";
var angle = 0;

var score = 0;
var step = 1;

var cheatMode = false;


var app = {
    hidding : undefined,
    ready: function(){
        $('.info').hide();
        $('.score').hide();
        $('.cheat').hide();
        allowSwipe();
        app.start();
    },
    start: function(){
    	cheatMode = false;
		$('.cheat').hide();
        score = 0;
        app.setScore();
        step = 1;
        backgroundOpacity = 0;
        lastOpacity = backgroundOpacity;

        app.setBackground(100);
        $('.info').html("TAP TO START").show();
        $('.info').on('touchstart',function(){
            $('.info').off('touchstart');
            $('.info').html("3").show();
            setTimeout(function(){
                $('.info').html("2");  
            },1000);

            setTimeout(function(){
                $('.info').html("1");
                app.changeOrientation();
            },2000);

            setTimeout(function(){
                $('.info').hide();
        		$('.score').show();
                app.changeTimeout(50);
            },3000);
        });
    },
    play : function()
    {
   		backgroundOpacity += step

        app.setBackground(backgroundOpacity);


        if(score == 20)
        {
            var nbClick = 0;
            $('.cheat').show();
            $('.cheat').on('touchstart',function(){
                nbClick++;
                if(nbClick ==5)
                {
                    cheatMode = true;
                    $('.cheat').hide();
                    $('.cheat').off('touchstart');
                }
            });
        }
        if(score == 21)
        {
            $('.cheat').hide();
            $('.cheat').off('touchstart');
        }

        if(backgroundOpacity > 110)
        {
            app.lose();
        }
    },
    lose: function(){
        clearInterval(app.hidding);
        app.hidding = undefined;
        app.setBackground(100);

        $('.score').hide();
        $('.info').html("SCORE : " + score).show();
        setTimeout(function(){
	        $('.info').on('touchstart',function(){
	            $('.info').off('touchstart');
	            $('.info').hide();
	            app.start();
	        })
        },1000);
    },
    setBackground : function(op)
    {
        $('body').css("background-color", "rgba(0,0,255," + op/100 + ")");
    },
    changeOrientation : function(){
    	do
    	{
    		var tmpDirection = infoDirection[Math.floor(Math.random()*4)];
    		tmpDirection = cheatMode ? "left" : tmpDirection;
    	}while(currentDirection == tmpDirection && !cheatMode);

    	switch(currentDirection)
    	{
    		case "right":
    		    switch(tmpDirection)
		    	{
		    		case "left" :
		    			angle += 180;
						break;
					case "up" :
		    			angle -= 90;
						break;
					case "right" :
						break;
					case "down" :
		    			angle += 90;
						break;
		    	}
				break;
			case "down":
    		    switch(tmpDirection)
		    	{
		    		case "left" :
		    			angle += 90;
						break;
					case "up" :
		    			angle -= 180;
						break;
					case "right" :
		    			angle -= 90;
						break;
					case "down" :
						break;
		    	}
				break;
			case "left":
    		    switch(tmpDirection)
		    	{
		    		case "left" :
						break;
					case "up" :
		    			angle += 90;
						break;
					case "right" :
		    			angle += 180;
						break;
					case "down" :
		    			angle -= 90;
						break;
		    	}
				break;
			case "up":
    		    switch(tmpDirection)
		    	{
		    		case "left" :
		    			angle -= 90;
						break;
					case "up" :
						break;
					case "right" :
		    			angle += 90;
						break;
					case "down" :
		    			angle -= 180;
						break;
		    	}
				break;
    	}
        currentDirection = tmpDirection;
        $('.direction').css({
			"-webkit-transform": "rotateZ(" + angle + "deg)",
			"transform": "rotateZ(" + angle + "deg)"
        });
    },
    changeTimeout : function(delay){
        if(app.hidding)
            clearInterval(app.hidding);
        $('body').css({
            '-webkit-transition': delay/1000 + 's linear',
            'transition': delay/1000 + 's linear'
        });
        app.hidding = setInterval(app.play,delay);
    },
    setScore : function()
    {
    	$(".score").html(score);
    }
};

$(function() { 
    //app.ready(); 
    document.addEventListener('deviceready', app.ready);
});

function allowSwipe()
{
    $("body").swipe({
        swipeStatus:function(event, phase, direction, distance, duration, fingers)
        {
            if(app.hidding)
            {
                if (phase=="end")
                {
                    if(currentDirection == direction)
                    {
                        backgroundOpacity -= 10; 
                        if(backgroundOpacity < lastOpacity && backgroundOpacity < 0.9)
				        {
				        	step += 0.004;
				        }
                        lastOpacity = backgroundOpacity;

                        backgroundOpacity = backgroundOpacity < -20 ? 0 : backgroundOpacity;
                        score++;
                    	app.setScore();
                    }
                    else
                    {
                        app.lose();
                    }
                    app.changeOrientation();
                }
            }
        },
        threshold:10,
        triggerOnTouchEnd:false,
        maxTimeThreshold:5000
    });
}