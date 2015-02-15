'use strict';

var expect = chai.expect;

describe("Insoo's unit test", function() {

  it('inserting imageModel', function() {
      var modelModule = createModelModule();
      var imageCollectionModel = new modelModule.ImageCollectionModel();

      var imageTempModel = new modelModule.ImageModel(
          '/images/' + "testing.png",
          new Date(),
          '',
          0
      );
      imageCollectionModel.addImageModel(imageTempModel);
      expect(imageCollectionModel.imageModels.length, 'Collection should have 1 imageModel').to.equal(1);
  });

  it('removing imageModel', function() {
      var modelModule = createModelModule();
      var imageCollectionModel = new modelModule.ImageCollectionModel();

      var imageTempModel = new modelModule.ImageModel(
          '/images/' + "testing.png",
          new Date(),
          '',
          0
      );
      imageCollectionModel.addImageModel(imageTempModel);
      expect(imageCollectionModel.imageModels.length, 'Collection should have 1 imageModel').to.equal(1);

      imageCollectionModel.removeImageModel(imageTempModel);
      expect(imageCollectionModel.imageModels.length, 'Collection should have 0 imageModel').to.equal(0);
  });

  it('changing imageModel rating', function(){
      var modelModule = createModelModule();
      var imageCollectionModel = new modelModule.ImageCollectionModel();

      var imageTempModel = new modelModule.ImageModel(
          '/images/' + "testing.png",
          new Date(),
          '',
          0
      );
      imageCollectionModel.addImageModel(imageTempModel);
      expect(imageCollectionModel.imageModels[0].getRating(), 'default image should have rating 0').to.equal(0);

      imageCollectionModel.imageModels[0].setRating(3)
      expect(imageCollectionModel.imageModels[0].getRating(), 'now the image should have rating 3').to.equal(3);

  });

  it('adding and removing listeners on imageCollectionModel', function() {
      var modelModule = createModelModule();
      var imageCollectionModel = new modelModule.ImageCollectionModel();

      var imageModel = new modelModule.ImageModel(
          '/images/' + "testing.png",
          new Date(),
          '',
          0
      );

      var listener_fn = sinon.spy();
      var addListenerSpy = sinon.spy(imageCollectionModel, "addListener");
      imageCollectionModel.addListener(listener_fn);

      expect(addListenerSpy.calledWith(listener_fn), 'addListener is called with listener_fn').to.be.true;
      expect(addListenerSpy.calledOnce, 'addListener is called once').to.be.true;

      var removeListenerSpy = sinon.spy(imageCollectionModel, "removeListener");
      imageCollectionModel.removeListener(listener_fn);

      expect(removeListenerSpy.calledWith(listener_fn), 'removeListener is called with listener_fn').to.be.true;
      expect(removeListenerSpy.calledOnce, 'removeListener is called once').to.be.true;
  });

  it('adding and removing listeners on imageModel', function() {
      var modelModule = createModelModule();
      var imageCollectionModel = new modelModule.ImageCollectionModel();

      var imageModel = new modelModule.ImageModel(
          '/images/' + "testing.png",
          new Date(),
          '',
          0
      );

      var listener_fn = sinon.spy();
      var addListenerSpy = sinon.spy(imageModel, "addListener");
      imageModel.addListener(listener_fn);

      expect(addListenerSpy.calledWith(listener_fn), 'addListener is called with listener_fn').to.be.true;
      expect(addListenerSpy.calledOnce, 'addListener is called once').to.be.true;

      var removeListenerSpy = sinon.spy(imageModel, "removeListener");
      imageModel.removeListener(listener_fn);

      expect(removeListenerSpy.calledWith(listener_fn), 'removeListener is called with listener_fn').to.be.true;
      expect(removeListenerSpy.calledOnce, 'removeListener is called once').to.be.true;
  });

});
