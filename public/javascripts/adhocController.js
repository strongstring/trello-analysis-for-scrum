function initPage() {
  var serviceBoard = $('#serviceBoard');

  MVCall('/api/serviceList', function(res) {

    serviceBoard.empty();

    var header = $('<li class="desc_header"> \
                      <div class="desc_name"> \
                        <p> name </p> \
                      </div> \
                      <div class="desc_comment"> \
                        <p>Latest Version</p> \
                      </div> \
                    </li>');
    serviceBoard.append(header);                              // 헤더추가 

    var length = res.length;
    for(var i = 0; i < length; i++) {
      var service = res[i];

      var versionInfo = "";
      if(service.link.ios !== undefined) {
        versionInfo += '<p style="margin-top:20px"> iOS : ' + service.link.ios.version + '</p>';
      }

      if(service.link.android !== undefined) {
        versionInfo += '<p> Android : ' + service.link.android.version + '</p>';
      }

      var content = $('<li> \
                        <a href="/page/' + service.page + '"> \
                        <div class="imageSpace"> \
                          <img src="' + service.imageUrl + '" /> \
                        </div> \
                        <div class="comment"> \
                          <div class="app_name"> \
                            <p>' + service.name + '</p> \
                          </div> \
                          <div class="latest_version"> \
                          ' + versionInfo + ' \
                          </div> \
                        </div> \
                        </a> \
                      </li>');

      serviceBoard.append(content);                         // 리스트 추가

    }
  }, function(error) {
    console.log(error);
  });
}


$(document).ready(function() {
  initPage();
});