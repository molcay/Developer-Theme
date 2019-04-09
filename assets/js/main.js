const EXTERNAL_PROFILE_SOURCE = "/profile.json";

function setRSSFeed(selector, url) {
  const config = {
    // how many entries do you want?
    // default: 4
    // valid values: any integer
    limit: 3,

    // the effect, which is used to let the entries appear
    // default: 'show'
    // valid values: 'show', 'slide', 'slideFast', 'slideSynced', 'slideFastSynced'
    effect: 'slideFastSynced',

    // will request the API via https
    // default: false
    // valid values: false, true
    ssl: true,

    // outer template for the html transformation
    // default: "<ul>{entries}</ul>"
    // valid values: any string
    layoutTemplate: "<div class='items'>{entries}</div>",

    // inner template for each entry
    // default: '<li><a href="{url}">[{author}@{date}] {title}</a><br/>{shortBodyPlain}</li>'
    // valid values: any string
    entryTemplate: '<div class="item"><h3 class="title"><a href="{url}" target="_blank">{title}</a></h3><div><p>{shortBodyPlain}</p><a class="more-link" href="{url}" target="_blank"><i class="fas fa-external-link-alt"></i>Read more</a></div></div>'

  };

  $(selector).rss(url, config);
}

function initBootstrapTooltip() {
  /* Bootstrap Tooltip for Skillset */
  $('.level-label').tooltip();
}

function initSkillset() {
  $('.level-bar-inner').css('width', '0');

    $(window).on('load', function() {

        $('.level-bar-inner').each(function() {

            var itemWidth = $(this).data('level');

            $(this).animate({
                width: itemWidth
            }, 800);

        });

    });
}

const app = new Vue({
  el: '#app',
  data: {
    profile: {},
  },
  created() {
    if (EXTERNAL_PROFILE_SOURCE) {
      fetch(EXTERNAL_PROFILE_SOURCE).then(resp => resp.text()).then(raw  => {
        this.profile = JSON.parse(raw);
      }).then(this.initPlugins);
    }
  },
  mounted() {
    initSkillset();
    initBootstrapTooltip();
  },
  computed: {
    isGithubActivityFeedActive() {
      return this.profile && this.profile.plugins && this.profile.plugins.githubActivityFeed && this.profile.plugins.githubActivityFeed.active;
    },
    isGithubCalendarActive() {
      return this.profile && this.profile.plugins && this.profile.plugins.githubCalendar && this.profile.plugins.githubCalendar.active;
    },
    isRSSFeedActive() {
      return this.profile && this.profile.plugins && this.profile.plugins.rss && this.profile.plugins.rss.active;
    },
    hasLatestProjects() {
      return !!this.profile.latestProjects;
    },
    hasOtherProjects() {
      return !!this.profile.otherProjects;
    },
    hasAddress() {
      return !!this.profile.address;
    },
  },
  methods: {
    initPlugins: function() {
      const pluginsConfig = this.profile.plugins;

      if (this.isGithubActivityFeedActive) {
        new GitHubCalendar("#github-graph", pluginsConfig.githubCalendar.username);
      }

      if (this.isGithubCalendarActive) {
        GitHubActivity.feed({ selector: "#ghfeed", username: pluginsConfig.githubActivityFeed.username });
      }

      if (this.isRSSFeedActive) {
        setRSSFeed("#rss-feeds", pluginsConfig.rss.url);
      }
    }
  },
});
