'use strict';

/**
 * A function that creates and returns all of the model classes and constants.
  */
function createViewModule() {

    var LIST_VIEW = 'LIST_VIEW';
    var GRID_VIEW = 'GRID_VIEW';
    var RATING_CHANGE = 'RATING_CHANGE';
    var IMAGE_ADDED_TO_COLLECTION_EVENT = 'IMAGE_ADDED_TO_COLLECTION_EVENT';
    var IMAGE_REMOVED_FROM_COLLECTION_EVENT = 'IMAGE_REMOVED_FROM_COLLECTION_EVENT';
    var IMAGE_META_DATA_CHANGED_EVENT = 'IMAGE_META_DATA_CHANGED_EVENT';

    /**
     * An object representing a DOM element that will render the given ImageModel object.
     */
    var ImageRenderer = function(imageModel) {
        this.currentView = LIST_VIEW;
        this.imageModel = imageModel;
        this.init(imageModel);
        this.element;
    };

    _.extend(ImageRenderer.prototype, {

        init:function(imageModel){
            var parentDiv = document.getElementsByClassName('dataList');
            this.element = document.createElement('div');
            var imagePath = imageModel.path.split('/');
            this.element.classList.add('dataElement');
            var imageTag = document.createElement('img');
            imageTag.src = "." + imageModel.path;
            imageTag.classList.add('image');
            var self = this;
            imageTag.onclick = function(){
                self.element.classList.toggle('enlarge');
            }
            var imageDescription = document.createElement('div');
            imageDescription.classList.add('imageDescription');
            var imageName = document.createElement('span');
            imageName.classList.add('imageName');
            var imageDate = document.createElement('span');
            imageDate.classList.add('imageDate');
            imageDate.innerText = imageModel.modificationDate.getMonth()+1 + "/" + imageModel.modificationDate.getDate() + "/" + imageModel.modificationDate.getFullYear();
            imageName.innerText = imagePath[imagePath.length - 1];

            var imageRating = document.createElement('div');
            imageRating.classList.add('ratingFilter');
            imageRating.classList.add('starSection');

            for(var i = 5; i > imageModel.rating; i--){
                var star = document.createElement('span');
                star.classList.add('emptyStar');
                (function(i){star.onclick = function(){
                    imageModel.setRating(i);
                }})(i);
                imageRating.appendChild(star);
            }
            for(var i = imageModel.rating; i > 0; i--){
                var star = document.createElement('span');
                star.classList.add('filledStar');
                (function(i){star.onclick = function(){
                    imageModel.setRating(i);
                }})(i);
                imageRating.appendChild(star);
            }

            imageDescription.appendChild(imageName);
            imageDescription.appendChild(imageDate);
            imageDescription.appendChild(imageRating);
            this.element.appendChild(imageTag);
            this.element.appendChild(imageDescription);
            parentDiv[0].appendChild(this.element);
        },

        updateValues:function(){
            var els = this.element.querySelectorAll(".starSection span");
            for(var i = 0; i < this.imageModel.rating; i++){
                els[4-i].classList.remove('emptyStar');
                els[4-i].classList.add('filledStar');
            }
            for(var i = this.imageModel.rating; i < 5; i++){
                els[4-i].classList.remove('filledStar');
                els[4-i].classList.add('emptyStar');
            }
        },

        /**
         * Returns an element representing the ImageModel, which can be attached to the DOM
         * to display the ImageModel.
         */
        getElement:function() {
            return this.element;
        },

        /**
         * Returns the ImageModel represented by this ImageRenderer.
         */
        getImageModel: function() {
            return this.imageModel;
        },

        /**
         * Sets the ImageModel represented by this ImageRenderer, changing the element and its
         * contents as necessary.
         */
        setImageModel: function(imageModel) {
            this.imageModel = imageModel;
        },

        /**
         * Changes the rendering of the ImageModel to either list or grid view.
         * @param viewType A string, either LIST_VIEW or GRID_VIEW
         */
        setToView: function(viewType) {
            this.currentView = viewType;
        },

        /**
         * Returns a string of either LIST_VIEW or GRID_VIEW indicating which view type it is
         * currently rendering.
         */
        getCurrentView: function() {
            return this.currentView;
        }
    });

    /**
     * A factory is an object that creates other objects. In this case, this object will create
     * objects that fulfill the ImageRenderer class's contract defined above.
     */
    var ImageRendererFactory = function() {
    };

    _.extend(ImageRendererFactory.prototype, {

        /**
         * Creates a new ImageRenderer object for the given ImageModel
         */
        createImageRenderer: function(imageModel) {
            return new ImageRenderer(imageModel);
        }
    });

    /**
     * An object representing a DOM element that will render an ImageCollectionModel.
     * Multiple such objects can be created and added to the DOM (i.e., you shouldn't
     * assume there is only one ImageCollectionView that will ever be created).
     */
    var ImageCollectionView = function() {
        this.imageRendererFactory = null;
        this.imageCollectionModel = null;
        this.imageRenderers = [];
    };

    _.extend(ImageCollectionView.prototype, {
        /**
         * Returns an element that can be attached to the DOM to display the ImageCollectionModel
         * this object represents.
         */
        getElement: function() {
            return document.getElementsByClassName('dataList');
        },

        setToolbar: function(toolbar){
            var self = this;
            toolbar.addListener(function(tb, type, date){
                var rating = tb.getCurrentRatingFilter();
                _.each(self.imageRenderers, function(imageRenderer){
                    if(imageRenderer.imageModel.getRating() >= rating){
                        imageRenderer.element.classList.remove('hide');
                    }else{
                        imageRenderer.element.classList.add('hide');
                    }
                });
            });
        },
        /**
         * Gets the current ImageRendererFactory being used to create new ImageRenderer objects.
         */
        getImageRendererFactory: function() {
            return this.imageRendererFactory;
        },

        /**
         * Sets the ImageRendererFactory to use to render ImageModels. When a *new* factory is provided,
         * the ImageCollectionView should redo its entire presentation, replacing all of the old
         * ImageRenderer objects with new ImageRenderer objects produced by the factory.
         */
        setImageRendererFactory: function(imageRendererFactory) {
            this.imageRendererFactory = imageRendererFactory;
            // TODO
        },

        /**
         * Returns the ImageCollectionModel represented by this view.
         */
        getImageCollectionModel: function() {
            return this.imageCollectionModel;
        },

        /**
         * Sets the ImageCollectionModel to be represented by this view. When setting the ImageCollectionModel,
         * you should properly register/unregister listeners with the model, so you will be notified of
         * any changes to the given model.
         */
        setImageCollectionModel: function(imageCollectionModel) {
            var self = this;
            imageCollectionModel.addListener(function(eventType, imageModelCollection, imageModel, eventDate){
                    if(eventType === IMAGE_ADDED_TO_COLLECTION_EVENT){
                        self.imageRenderers.push(self.imageRendererFactory.createImageRenderer(imageModel));
                    }
                    else if(eventType === IMAGE_REMOVED_FROM_COLLECTION_EVENT){
                        //TODO
                    }
                    else if(eventType === IMAGE_META_DATA_CHANGED_EVENT){
                        _.each(self.imageRenderers, function(imageRenderer){
                                if(imageRenderer.getImageModel() === imageModel){
                                    imageRenderer.updateValues();
                                }
                        });
                    }
            });
            this.imageCollectionModel = imageCollectionModel;
        },
        /**
         * Changes the presentation of the images to either grid view or list view.
         * @param viewType A string of either LIST_VIEW or GRID_VIEW.
         */
        setToView: function(viewType) {
            // TODO
        },

        /**
         * Returns a string of either LIST_VIEW or GRID_VIEW indicating which view type is currently
         * being rendered.
         */
        getCurrentView: function() {
            // TODO
        }
    });

    /**
     * An object representing a DOM element that will render the toolbar to the screen.
     */
    var Toolbar = function() {
        this.listeners = [];
        this.viewType;
        this.ratingFilter = 0;
    };

    _.extend(Toolbar.prototype, {
        /**
         * Returns an element representing the toolbar, which can be attached to the DOM.
         */
        getElement: function() {
            return document.getElementsByClassName('header');
        },

        /**
         * Registers the given listener to be notified when the toolbar changes from one
         * view type to another.
         * @param listener_fn A function with signature (toolbar, eventType, eventDate), where
         *                    toolbar is a reference to this object, eventType is a string of
         *                    either, LIST_VIEW, GRID_VIEW, or RATING_CHANGE representing how
         *                    the toolbar has changed (specifically, the user has switched to
         *                    a list view, grid view, or changed the star rating filter).
         *                    eventDate is a Date object representing when the event occurred.
         */
        addListener: function(listener_fn) {
            this.listeners.push(listener_fn);
        },

        /**
         * Removes the given listener from the toolbar.
         */
        removeListener: function(listener_fn) {
            for(var i = 0; i < this.listeners.length; i++){
                if(""+this.listeners[i] ==""+listener_fn){
                    this.listeners.splice(i,1);
                }
            }
        },

        /**
         * Sets the toolbar to either grid view or list view.
         * @param viewType A string of either LIST_VIEW or GRID_VIEW representing the desired view.
         */
        setToView: function(viewType) {
            this.viewType = viewType;
            if(viewType === LIST_VIEW){
                document.getElementById('body').classList.remove('grid');
            }
            else if(viewType === GRID_VIEW){
                document.getElementById('body').classList.add('grid');
            }
        },

        /**
         * Returns the current view selected in the toolbar, a string that is
         * either LIST_VIEW or GRID_VIEW.
         */
        getCurrentView: function() {
            return this.viewType;
        },

        /**
         * Returns the current rating filter. A number in the range [0,5], where 0 indicates no
         * filtering should take place.
         */
        getCurrentRatingFilter: function() {
            return this.ratingFilter;
        },

        /**
         * Sets the rating filter.
         * @param rating An integer in the range [0,5], where 0 indicates no filtering should take place.
         */
        setRatingFilter: function(rating) {
            this.ratingFilter = rating;
            for(var i = 0; i < this.listeners.length; i++){
                this.listeners[i](this, RATING_CHANGE, new Date());
            }

            var tem = document.querySelectorAll('.header .ratingFilter span');
            for(var i = 0; i < rating; i++){
                tem[4-i].classList.remove('emptyStar');
                tem[4-i].classList.add('filledStar');
            }
            for(var i = rating; i < 5; i++){
                tem[4-i].classList.remove('filledStar');
                tem[4-i].classList.add('emptyStar');
            }
        }
    });

    /**
     * An object that will allow the user to choose images to display.
     * @constructor
     */
    var FileChooser = function() {
        this.listeners = [];
        this._init();
    };

    _.extend(FileChooser.prototype, {
        // This code partially derived from: http://www.html5rocks.com/en/tutorials/file/dndfiles/
        _init: function() {
            var self = this;
            this.fileChooserDiv = document.createElement('div');
            var fileChooserTemplate = document.getElementById('file-chooser');
            this.fileChooserDiv.appendChild(document.importNode(fileChooserTemplate.content, true));
            var fileChooserInput = this.fileChooserDiv.querySelector('.files-input');
            fileChooserInput.addEventListener('change', function(evt) {
                var files = evt.target.files;
                var eventDate = new Date();
                _.each(
                    self.listeners,
                    function(listener_fn) {
                        listener_fn(self, files, eventDate);
                    }
                );
            });
        },

        /**
         * Returns an element that can be added to the DOM to display the file chooser.
         */
        getElement: function() {
            return this.fileChooserDiv;
        },

        /**
         * Adds a listener to be notified when a new set of files have been chosen.
         * @param listener_fn A function with signature (fileChooser, fileList, eventDate), where
         *                    fileChooser is a reference to this object, fileList is a list of files
         *                    as returned by the File API, and eventDate is when the files were chosen.
         */
        addListener: function(listener_fn) {
            if (!_.isFunction(listener_fn)) {
                throw new Error("Invalid arguments to FileChooser.addListener: " + JSON.stringify(arguments));
            }

            this.listeners.push(listener_fn);
        },

        /**
         * Removes the given listener from this object.
         * @param listener_fn
         */
        removeListener: function(listener_fn) {
            if (!_.isFunction(listener_fn)) {
                throw new Error("Invalid arguments to FileChooser.removeListener: " + JSON.stringify(arguments));
            }
            this.listeners = _.without(this.listeners, listener_fn);
        }
    });

    // Return an object containing all of our classes and constants
    return {
        ImageRenderer: ImageRenderer,
        ImageRendererFactory: ImageRendererFactory,
        ImageCollectionView: ImageCollectionView,
        Toolbar: Toolbar,
        FileChooser: FileChooser,

        LIST_VIEW: LIST_VIEW,
        GRID_VIEW: GRID_VIEW,
        RATING_CHANGE: RATING_CHANGE
    };
}
