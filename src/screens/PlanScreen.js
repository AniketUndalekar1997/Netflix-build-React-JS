import React, { useState, useEffect } from "react";
import db from "../firebase";
import "./PlanScreen.css";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { loadStripe } from "@stripe/stripe-js";
import { subscribe } from "../features/userSlice";
import { selectSubscription } from "../features/userSlice";

function PlanScreen() {
  const [product, setProduct] = useState([]);
  const user = useSelector(selectUser);
  const [subscription, setSubscription] = useState(null);
  const dispatchSubscription = useSelector(selectSubscription);
  const dispatch = useDispatch();

  useEffect(() => {
    db.collection("customers")
      .doc(user.uid)
      .collection("subscriptions")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(async (subscription) => {
          setSubscription({
            role: subscription.data().role,
            current_period_start:
              subscription.data().current_period_start.seconds,
            current_period_end: subscription.data().current_period_end.seconds,
          });

          dispatch(subscribe({ isSubscribed: true }));
        });
      });

    // Cleanup
    return subscription;
  }, [user.uid, dispatch]);

  useEffect(() => {
    db.collection("products")
      .where("active", "==", true)
      .get()
      .then((querySnapshot) => {
        const products = {};
        querySnapshot.forEach(async (productDoc) => {
          products[productDoc.id] = productDoc.data();
          const priceSnap = await productDoc.ref.collection("prices").get();
          priceSnap.docs.forEach((price) => {
            products[productDoc.id].prices = {
              priceId: price.id,
              priceData: price.data,
            };
          });
        });
        setProduct(products);
      });
  }, []);

  //   console.log(product);

  const loadCheckout = async (priceId) => {
    const docRef = await db
      .collection("customers")
      .doc(user.uid)
      .collection("checkout_sessions")
      .add({
        price: priceId,
        success_url: window.location.origin,
        cancel_url: window.location.origin,
      });
    // Wait for the CheckoutSession to get attached by the extension

    docRef.onSnapshot(async (snap) => {
      const { error, sessionId } = snap.data();
      if (error) {
        // Show an error to your customer and
        // inspect your Cloud Function logs in the Firebase console.
        alert(`An error occured: ${error.message}`);
      }
      if (sessionId) {
        // We have a Stripe Checkout sessionId, let's redirect.
        const stripe = await loadStripe(
          "pk_test_51JgZIdSIbqN7V7nGqPfTFqPTjDDo0O0ztG2A2Mhma2j8DmsjsCBnrKei3Vc8PhrOCFC07YwvrMhCglimEQvND4xr00vnwhiu6g"
        );
        stripe.redirectToCheckout({ sessionId });
      }
    });
  };

  return (
    <div className="planScreen">
      {Object.entries(product).map(([productId, productData]) => {
        //TODO add some logic to check if the users subscription is active
        const isCurrentPackage = productData.name
          ?.toLowerCase()
          .includes(subscription?.role.toLowerCase());

        return (
          <div
            key={productId}
            className={`${
              isCurrentPackage && "planScreen__plan--disabled"
            } planScreen__plan`}
          >
            <div className="planScreen__info">
              <h5>{productData.name}</h5>
              <h6>{productData.description}</h6>
            </div>
            <button
              onClick={() =>
                !isCurrentPackage && loadCheckout(productData.prices.priceId)
              }
            >
              {isCurrentPackage ? "Current Package" : "Subscribe"}
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default PlanScreen;
