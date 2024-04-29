<?php
// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Collect and sanitize input data
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $product = htmlspecialchars($_POST['product']);
    $quantity = (int)$_POST['quantity'];

    // Simple validation to check if all fields are filled
    if (!empty($name) && !empty($email) && !empty($product) && $quantity > 0) {
        // Normally, here you would handle storing the order data in a database or sending an email
        // For demonstration, we'll just display the data
        echo "<h1>Thank you for your order, " . $name . "!</h1>";
        echo "<p>Your order details:</p>";
        echo "<ul>";
        echo "<li>Email: " . $email . "</li>";
        echo "<li>Product: " . $product . "</li>";
        echo "<li>Quantity: " . $quantity . "</li>";
        echo "</ul>";
    } else {
        // If fields are missing, display an error message
        echo "<p>Error: All fields are required and quantity must be greater than zero.</p>";
    }
} else {
    // If the form is not submitted, redirect back to the main page or form page
    echo "<p>Error: No data submitted.</p>";
}
?>
