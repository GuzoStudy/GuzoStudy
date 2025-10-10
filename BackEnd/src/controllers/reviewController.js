import Review from '../models/Review.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';

// Submit a review
export const submitReview = async (req, res) => {
  const { courseId } = req.params;
  const { rating, comment } = req.body;
  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const enrollment = await Enrollment.findOne({
      user: req.user.id,
      course: courseId,
      paymentStatus: 'completed',
    });
    if (!enrollment) return res.status(403).json({ message: 'Not enrolled or payment pending' });

    const existingReview = await Review.findOne({ user: req.user.id, course: courseId });
    if (existingReview) return res.status(400).json({ message: 'Review already submitted' });

    const review = new Review({
      user: req.user.id,
      course: courseId,
      rating,
      comment,
    });
    await review.save();

    course.reviews.push(review._id);
    const reviews = await Review.find({ course: courseId });
    course.averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    await course.save();

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all reviews for a course
export const getCourseReviews = async (req, res) => {
  const { courseId } = req.params;
  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const reviews = await Review.find({ course: courseId })
      .populate('user', 'name')
      .select('rating comment createdAt');

    res.json({ averageRating: course.averageRating, reviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a review
export const updateReview = async (req, res) => {
  const { reviewId } = req.params;
  const { rating, comment } = req.body;
  try {
    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (review.user.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' });

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    await review.save();

    // Update course average
    const course = await Course.findById(review.course);
    const reviews = await Review.find({ course: review.course });
    course.averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    await course.save();

    res.json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  const { reviewId } = req.params;
  try {
    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (review.user.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' });

    await review.remove();

    // Remove review from course and update average
    const course = await Course.findById(review.course);
    course.reviews = course.reviews.filter(r => r.toString() !== reviewId);
    const remainingReviews = await Review.find({ course: course._id });
    course.averageRating =
      remainingReviews.length > 0
        ? remainingReviews.reduce((acc, r) => acc + r.rating, 0) / remainingReviews.length
        : 0;
    await course.save();

    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
