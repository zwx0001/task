var mySwiper = new Swiper('.container', {
    pagination: {
        el: ".pagination",
        clickable: true
    }
})
var myBScroll = new BScroll('.wrapper', {
    probeType: 2,
    click: true,
})
var idx = 0;
$.ajax({
    url: '/api/getData?idx=' + idx,
    success: function(res) {
        res = JSON.parse(res);
        if (res.code === 0) {
            render(res.data);
        } else {
            alert('请求失败!');
        }
    }
})

function render(data) {
    var str = '';
    data.map(function(item) {
        str += `
                <dl>
                    <dt><img src="./images/${item.img}" alt=""></dt>
                    <dd>
                        <p>${item.tit}</p>
                        <p>${item.menu}</p>
                         <p><span><b>${item.money}&nbsp;&nbsp;</b>门市价${item.price}元</span><span>已售${item.sell}</span></p>
                    </dd>
                </dl>
                `;
    })
    $('.list').append(str);
    myBScroll.refresh();
}

function render2(data) {
    var str = '';
    data.map(function(item) {
        str += `
                <dl>
                    <dt><img src="./images/${item.img}" alt=""></dt>
                    <dd>
                        <p>${item.tit}</p>
                        <p>${item.menu}</p>
                         <p><span><b>${item.money}&nbsp;&nbsp;</b>门市价${item.price}元</span><span>已售${item.sell}</span></p>
                    </dd>
                </dl>
                `;
    })
    $('.list').html(str);
    myBScroll.refresh();
}
$('.sec').fadeIn(1500);
//上拉加载
myBScroll.on("scroll", function() {
    if (this.y < this.maxScrollY - 140) {
        $(".up").html("释放加载").addClass("flip");
    } else if (this.y < 0 && this.y > this.maxScrollY - 100) {
        $(".up").html("上拉加载……").removeClass("flip");
    } else if (this.y > 70) {
        $(".down").html("释放刷新").addClass("flip");
    } else if (this.y > 0 && this.y < 10) {
        $(".down").html("下拉刷新……").removeClass("flip");
    }
});
myBScroll.on("scrollEnd", function() {
    if ($(".up").hasClass("flip")) {
        up();
        $(".up").html("上拉加载……").removeClass("flip");
    } else if ($(".down").hasClass("flip")) {
        down();
        $(".down").html("下拉刷新……").removeClass("flip");
    }
});

function up() {
    idx++;
    $.ajax({
        url: '/api/getData?idx=' + idx,
        success: function(res) {
            res = JSON.parse(res);
            if (res.code === 0) {
                if (res.data.length <= 0) {
                    $('footer').removeClass('none');
                    $('.up').addClass('none');
                } else {
                    $('footer').addClass('none');
                    $('.up').removeClass('none');
                }
                render(res.data);
            } else {
                alert('请求失败!');
            }
        }
    })
}

function down() {
    idx = 0;
    $('footer').addClass('none');
    $('.up').removeClass('none');
    $.ajax({
        url: '/api/getData?idx=' + idx,
        success: function(res) {
            res = JSON.parse(res);
            if (res.code === 0) {
                render2(res.data);
            } else {
                alert('请求失败!');
            }
        }
    })
}