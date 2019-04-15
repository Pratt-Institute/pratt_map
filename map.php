<html>

<head>
  <title>Ambiarc</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <link rel="stylesheet" media="all" href="css/bootstrap/bootstrap.min.css?nc=<?php echo time(); ?>" />
  <link rel="stylesheet" media="all" href="css/splash.css?nc=<?php echo time(); ?>" />

  <script src="TemplateData/js/jquery-2.2.4.min.js?nc=<?php echo time(); ?>"></script>
  <script src="TemplateData/js/bootstrap.min.js?nc=<?php echo time(); ?>"></script>
  <script src="TemplateData/js/UnityProgress.js?nc=<?php echo time(); ?>"></script>
  <script src="TemplateData/js/ambiarc.js?nc=<?php echo time(); ?>"></script>
  <script src="TemplateData/js/ambiarc-theme.js?nc=<?php echo time(); ?>"></script>
  <script src="map/3544178c924aac8c5129f2d974d60dd7.js?nc=<?php echo time(); ?>"></script>
  <script src="TemplateData/js/UnityCompatibility.js?nc=<?php echo time(); ?>"></script>

  <script>

    ///var gameInstance = UnityLoader.instantiate("gameContainer", "map/77448287a7e719cee5c3228556fc4962.json?nc=<?php echo time(); ?>", {
    var gameInstance = UnityLoader.instantiate("gameContainer", "map/3771d2a502e93bf4d8e431a496eb1908.json?nc=<?php echo time(); ?>", {

      onProgress: UnityProgress,
      Module: {
        onRuntimeInitialized: function() {
          UnityProgress(gameInstance, "complete");
        }
      }
    });

  </script>
</head>

<body class="guide-kick-background" oncontextmenu="return false;">
    <div id="gameContainer" hidden="">
      <canvas id="#canvas"></canvas>
      <div class="logo Dark">
      </div>
    </div>

    <!-- Compat Modal -->
    <div class="modal fade" id="CompatModal">
          <div class="modal-dialog" role="document">
          <div class="modal-content">
              <div class="modal-body">
                 <p>This device or browser is not fully supported, so the map expierence may not work as expected.</p>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" id="CompatModalGoBack">Go back</button>
                <button type="button" class="btn btn-secondary"  id="CompatModalContinue"  data-dismiss="modal">Continue</button>
              </div>
          </div>
        </div>
    </div>

    <div id="gk-loading-container" class="gk-loading-container">
      <div class="ambiarc-logo-container" id="ambiarc-logo-container">
        <img class="ambiarc-logo" src="images/pratt-yellow-1263-400.png" alt="ambiarc logo">
      </div>
      <div class="gap"></div>

      <div id="progressMessageDiv" class="progressMessage">
        <p id="progressMessage"></p>
      </div>

      <div id="gk-progress" class="gk-progress">
        <div id="empty" class="empty"></div>
        <div id="full" class="full"></div>
      </div>

      <div id="progressSpinnerHolder" class="progressSpinnerHolder">
        <div class="progressSpinner"></div>
      </div>
    </div>
</body>

</html>
