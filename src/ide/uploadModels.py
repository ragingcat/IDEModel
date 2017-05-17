from django.db import models
from django.utils.encoding import python_2_unicode_compatible

# Create your models here.
@python_2_unicode_compatible
class Question(models.Model):
	def __str__(self):
		return self.question_text
	def was_published_recently(self):
		return self.pub_date >= timezone.now() - datetime.timedelta(days=1)
	question_text = models.CharField(max_length=200)
	pub_date = models.DateTimeField('date published')

@python_2_unicode_compatible
class Choice(models.Model):
	def __str__(self):
		return self.choice_text

	question = models.ForeignKey(Question, on_delete=models.CASCADE)
	choice_text = models.CharField(max_length=200)
	votes = models.IntegerField(default=0)

class People(models.Model):
    name=models.CharField(max_length=20)
    leader=models.ForeignKey('self',blank=True,null=True)

class Person(models.Model):
    friends = models.ManyToManyField("self")

class Publication(models.Model):
    title = models.CharField(max_length=30)

    def __str__(self):              # __unicode__ on Python 2
        return self.title

    class Meta:
        ordering = ('title',)

class Article(models.Model):
    headline = models.CharField(max_length=100)
    publications = models.ManyToManyField(Publication)
    author = models.OneToOneField(People)

    def __str__(self):              # __unicode__ on Python 2
        return self.headline

    class Meta:
        ordering = ('headline',)


class Place(models.Model):
    name = models.CharField(max_length=50)
    address = models.CharField(max_length=80)

    def __str__(self):              # __unicode__ on Python 2
        return "%s the place" % self.name

class Restaurant(models.Model):
    place = models.OneToOneField(
        Place,
        on_delete=models.CASCADE,
        primary_key=True,
    )
    serves_hot_dogs = models.BooleanField(default=False)
    serves_pizza = models.BooleanField(default=False)

    def __str__(self):              # __unicode__ on Python 2
        return "%s the restaurant" % self.place.name

