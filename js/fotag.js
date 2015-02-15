'use strict';

// This should be your main point of entry for your app

window.addEventListener('load', function() {
    var modelModule = createModelModule();
    var viewModule = createViewModule();
    var appContainer = document.getElementById('app-container');

    // Attach the file chooser to the page. You can choose to put this elsewhere, and style as desired
    var fileChooser = new viewModule.FileChooser();
    appContainer.insertBefore(fileChooser.getElement(),appContainer.firstChild);
    var imageCollectionModel = new modelModule.ImageCollectionModel();
    var imageRendererFactory = new viewModule.ImageRendererFactory();
    var imageCollectionView = new viewModule.ImageCollectionView();
    imageCollectionView.setImageRendererFactory(imageRendererFactory);
    imageCollectionView.setImageCollectionModel(imageCollectionModel);

    var toolBar = new viewModule.Toolbar();
    document.getElementById('gridView').onclick = function(){
        toolBar.setToView('GRID_VIEW');
    }
    document.getElementById('listView').onclick = function(){
        toolBar.setToView('LIST_VIEW');
    }
    imageCollectionView.setToolbar(toolBar);
    var tem = document.querySelectorAll('.header .ratingFilter span');
    _.each(tem, function(star, index){
        star.onclick = function(){
            toolBar.setRatingFilter(5-index);
        }
    });

    fileChooser.addListener(function(fileChooser, files, eventDate) {
        _.each(
            files,
            function(file) {
                var imageTempModel = new modelModule.ImageModel(
                    '/images/' + file.name,
                    file.lastModifiedDate,
                    '',
                    0
                );
                imageCollectionModel.addImageModel(imageTempModel);
            }
        );
        modelModule.storeImageCollectionModel(imageCollectionModel);
    });

    //retrieve saved imageCollections
    var storedImageCollection = modelModule.loadImageCollectionModel();
    var storedImageModels = storedImageCollection.getImageModels();
    _.each(
        storedImageModels,
        function(imageModel) {
            imageCollectionModel.addImageModel(
                imageModel
            );
        }
    );
});
