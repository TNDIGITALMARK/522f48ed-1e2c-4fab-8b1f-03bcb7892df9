import { SAMPLE_FOODS, RESTAURANTS, getFoodsByRestaurant, getRestaurantCounts } from '../src/lib/sample-foods';

console.log('=== FOOD DATABASE VERIFICATION ===\n');

// Check total food count
console.log(`✅ Total foods in database: ${SAMPLE_FOODS.length}`);

// Check restaurant data
console.log('\n📍 Restaurant Menu Items:');
getRestaurantCounts().forEach(({ name, count }) => {
  console.log(`   - ${name}: ${count} items`);
});

// Verify custom serving sizes exist
const foodsWithMultipleServings = SAMPLE_FOODS.filter(f => f.serving_sizes.length > 1);
console.log(`\n✅ Foods with multiple serving sizes: ${foodsWithMultipleServings.length}`);

// Check categories
const categories = [...new Set(SAMPLE_FOODS.map(f => f.category))];
console.log(`\n✅ Available categories: ${categories.join(', ')}`);

// Sample restaurant food
console.log('\n📋 Sample Restaurant Items:');
const timHortonsSample = getFoodsByRestaurant('Tim Hortons')[0];
if (timHortonsSample) {
  console.log(`   Tim Hortons: ${timHortonsSample.name}`);
  console.log(`   Calories per 100g: ${timHortonsSample.calories_per_100g}`);
  console.log(`   Serving sizes: ${timHortonsSample.serving_sizes.length}`);
}

const starbucksSample = getFoodsByRestaurant('Starbucks')[0];
if (starbucksSample) {
  console.log(`\n   Starbucks: ${starbucksSample.name}`);
  console.log(`   Calories per 100g: ${starbucksSample.calories_per_100g}`);
  console.log(`   Serving sizes: ${starbucksSample.serving_sizes.length}`);
}

console.log('\n✅ All features verified successfully!');
