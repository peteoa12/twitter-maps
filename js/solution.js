var TwitterApi = (function(options) {
    var shared = {},
        options = options || {};

    function setupListeners() {
        console.log('setupListeners()');

        setupTimeline();
        setupSearch();
    }

    function setupTimeline() {

        $('form[name=timeline] button').click(function(event) {
            var $e = $(event.currentTarget),
                $form = $e.closest('form'),
                screen_name = $form.find('input[type=text]').val(),
                $results = $form.find('.results ul'),
                params = {};

            params['op'] = 'user_timeline';
            params['screen_name'] = screen_name;
            $.ajax({
                dataType: "json",
                url: 'twitter-proxy.php',
                data: params
            }).done(function(response) {
                $results.empty();
                for (var i = 0, max = response.length; i < max; i++) {
                    var r = response[i];
                    var status = r.text;
                    var li = document.createElement('li');
                    var txt = document.createTextNode(status);
                    li.appendChild(txt);
                    $results.append(li);
                }
            });

            return false;
        });
    }

    function setupSearch() {

        $('form[name=search] button').click(function(event) {
            var $e = $(event.currentTarget),
                $form = $e.closest('form'),
                params = {},
                $results = $form.find('.results ul'),
                keyword = $form.find('input[name=q]').val();

            params['op'] = 'search_tweets'; // which PHP function to run
            params['q'] = keyword; // argument for the Twitter search API
            var $count_f = $form.find('input[name=count]');
            if ($count_f) {
                params['count'] = $count_f.val(); // argument for the Twitter search API
            }
            var $result_type_f = $form.find('select[name=result_type]');
            if ($result_type_f) {
                params['result_type'] = $result_type_f.val(); // argument for the Twitter search API
            }

            $.ajax({
                dataType: "json",
                url: 'twitter-proxy.php',
                data: params
            }).done(function(response) {

                $results.empty();
                for (var s in response.statuses) {
                    var status = response.statuses[s];
                    var li = document.createElement('li');
                    var txt = status['text'];
                    var txtNode = document.createElement('span');
                    txtNode.innerHTML = txt
                    li.appendChild(txtNode);
                    $results.append(li);
                }
            });

            return false;
        });
    }

    var init = function() {
        console.log('init()');
        setupListeners();
    };
    shared.init = init;

    return shared;
}());

TwitterApi.init();