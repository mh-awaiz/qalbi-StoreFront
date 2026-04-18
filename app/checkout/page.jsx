"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  FiShoppingBag,
  FiMapPin,
  FiUser,
  FiMail,
  FiPhone,
  FiHome,
  FiTag,
  FiChevronRight,
  FiShield,
  FiTruck,
  FiCheckCircle,
  FiAlertCircle,
  FiLoader,
  FiPackage,
  FiArrowLeft,
  FiLock,
  FiX,
} from "react-icons/fi";
import { MdLocalShipping, MdVerified } from "react-icons/md";

const STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const FREE_SHIPPING_THRESHOLD = 999;
const STANDARD_SHIPPING = 99;

function usePincodeCheck(pincode) {
  const [status, setStatus] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!/^\d{6}$/.test(pincode)) {
      setStatus(null);
      return;
    }
    setStatus("checking");
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/shipping/check-pincode?pincode=${pincode}`,
        );
        const data = await res.json();
        if (!res.ok) {
          setStatus({
            serviceable: false,
            message: "Could not verify pincode. Please continue.",
          });
          return;
        }
        if (data.timedOut) {
          setStatus({ serviceable: true, timedOut: true, city: "", state: "" });
          return;
        }
        setStatus({
          serviceable: data.serviceable,
          city: data.city || "",
          state: data.state || "",
          prepaid: data.prepaidAvailable,
          cod: data.codAvailable,
          mock: data.mock,
          message: data.serviceable
            ? null
            : "Delivery not available at this pincode",
        });
      } catch {
        setStatus({ serviceable: true, timedOut: true, city: "", state: "" });
      }
    }, 600);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pincode]);

  return status;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "Maharashtra",
    pincode: "",
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [autoFilledCity, setAutoFilledCity] = useState(false);

  const pinStatus = usePincodeCheck(form.pincode);

  // Auto-fill city/state from pincode
  useEffect(() => {
    if (pinStatus?.serviceable && pinStatus.city && !autoFilledCity) {
      setForm((f) => ({
        ...f,
        city: f.city || pinStatus.city,
        state:
          pinStatus.state && STATES.includes(pinStatus.state)
            ? pinStatus.state
            : f.state,
      }));
      setAutoFilledCity(true);
    }
    if (!pinStatus || pinStatus === "checking") setAutoFilledCity(false);
  }, [pinStatus]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("qalbi_cart") || "[]");
      if (saved.length === 0) router.push("/shop");
      setCart(saved);
    } catch {
      router.push("/shop");
    }
  }, []);

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shippingCharge =
    subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
  const total = subtotal + shippingCharge;

  const update = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  const validateStep1 = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      e.email = "Valid email is required";
    if (!/^\d{10}$/.test(form.phone.replace(/\s/g, "")))
      e.phone = "Enter a valid 10-digit phone number";
    if (!form.line1.trim()) e.line1 = "Address line 1 is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.state) e.state = "State is required";
    if (!/^\d{6}$/.test(form.pincode))
      e.pincode = "Enter a valid 6-digit pincode";
    if (
      pinStatus &&
      pinStatus !== "checking" &&
      pinStatus.serviceable === false &&
      !pinStatus.timedOut
    ) {
      e.pincode = "Delivery not available at this pincode";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Straight through — no OTP step
  const handleProceedToReview = () => {
    if (validateStep1()) setStep(2);
  };

  const loadRazorpay = () =>
    new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.body.appendChild(s);
    });

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const loaded = await loadRazorpay();
      if (!loaded) {
        alert(
          "Payment gateway failed to load. Please check your internet and try again.",
        );
        setLoading(false);
        return;
      }
      const customer = {
        name: form.name,
        email: form.email,
        phone: form.phone,
      };
      const shippingAddress = {
        ...customer,
        line1: form.line1,
        line2: form.line2,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
      };

      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((i) => ({
            productId: i.productId || i.id || i._id,
            title: i.title,
            slug: i.slug || "",
            image: i.image || "",
            size: i.size || "",
            price: i.price,
            qty: i.qty,
          })),
          customer,
          shippingAddress,
          shippingCharge,
        }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok)
        throw new Error(orderData.error || "Failed to create order");

      const { orderId, razorpayOrder, keyId } = orderData;

      await new Promise((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: keyId,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          order_id: razorpayOrder.id,
          name: "Qalbi Couture",
          description: `Order — ${customer.name}`,
          image: "/logo.avif",
          prefill: {
            name: customer.name,
            email: customer.email,
            contact: customer.phone,
          },
          theme: { color: "#da3f3f" },
          modal: {
            ondismiss: () => {
              setLoading(false);
              reject(new Error("Payment cancelled"));
            },
          },
          handler: async (response) => {
            try {
              const verifyRes = await fetch("/api/payment/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderId,
                }),
              });
              const verifyData = await verifyRes.json();
              if (!verifyRes.ok)
                throw new Error(
                  verifyData.error || "Payment verification failed",
                );
              localStorage.removeItem("qalbi_cart");
              window.dispatchEvent(new Event("cart-updated"));
              resolve();
              router.push(
                `/order-confirmed?order=${verifyData.orderNumber}&id=${verifyData.orderId}`,
              );
            } catch (err) {
              reject(err);
            }
          },
        });
        rzp.open();
      });
    } catch (err) {
      if (err.message !== "Payment cancelled") {
        console.error("Checkout error:", err);
        alert("Something went wrong: " + err.message);
      }
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#faf6f1] flex items-center justify-center">
        <div className="text-center">
          <FiShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Your cart is empty</p>
          <button
            onClick={() => router.push("/shop")}
            className="mt-4 px-5 py-2.5 bg-[#da3f3f] text-white rounded-xl text-sm font-medium"
          >
            Shop Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#faf6f1]"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => (step === 2 ? setStep(1) : router.back())}
            className="text-gray-500 hover:text-gray-700 transition-colors p-1"
          >
            <FiArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#da3f3f] flex items-center justify-center">
              <span className="text-white font-bold text-xs">Q</span>
            </div>
            <span className="font-semibold text-gray-800 text-sm">
              Checkout
            </span>
          </div>
          <div className="ml-auto flex items-center gap-2 text-xs">
            <span
              className={`font-semibold ${step === 1 ? "text-[#da3f3f]" : "text-green-600"}`}
            >
              {step > 1 && <FiCheckCircle className="inline mr-1" size={12} />}
              1. Delivery
            </span>
            <FiChevronRight size={12} className="text-gray-300" />
            <span
              className={`font-semibold ${step === 2 ? "text-[#da3f3f]" : "text-gray-400"}`}
            >
              2. Review &amp; Pay
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 lg:py-10">
        <div className="grid lg:grid-cols-5 gap-6 lg:gap-10 items-start">
          {/* LEFT */}
          <div className="lg:col-span-3 space-y-5">
            {/* ── STEP 1 ── */}
            {step === 1 && (
              <>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                    <FiUser size={15} className="text-[#da3f3f]" />
                    <h2 className="font-semibold text-gray-900 text-sm">
                      Contact Details
                    </h2>
                  </div>
                  <div className="p-5 space-y-4">
                    <Field
                      label="Full Name"
                      icon={<FiUser size={14} />}
                      error={errors.name}
                    >
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        placeholder="Your full name"
                        className={inputCls(errors.name)}
                        autoComplete="name"
                      />
                    </Field>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field
                        label="Email Address"
                        icon={<FiMail size={14} />}
                        error={errors.email}
                      >
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => update("email", e.target.value)}
                          placeholder="your@email.com"
                          className={inputCls(errors.email)}
                          autoComplete="email"
                        />
                      </Field>
                      <Field
                        label="Phone Number"
                        icon={<FiPhone size={14} />}
                        error={errors.phone}
                      >
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) =>
                            update(
                              "phone",
                              e.target.value.replace(/\D/g, "").slice(0, 10),
                            )
                          }
                          placeholder="10-digit mobile number"
                          className={inputCls(errors.phone)}
                          autoComplete="tel"
                          inputMode="numeric"
                        />
                      </Field>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                    <FiMapPin size={15} className="text-[#da3f3f]" />
                    <h2 className="font-semibold text-gray-900 text-sm">
                      Delivery Address
                    </h2>
                  </div>
                  <div className="p-5 space-y-4">
                    <Field
                      label="Address Line 1"
                      icon={<FiHome size={14} />}
                      error={errors.line1}
                    >
                      <input
                        type="text"
                        value={form.line1}
                        onChange={(e) => update("line1", e.target.value)}
                        placeholder="House / Flat / Society name"
                        className={inputCls(errors.line1)}
                        autoComplete="address-line1"
                      />
                    </Field>
                    <Field
                      label="Address Line 2 (Optional)"
                      icon={<FiHome size={14} />}
                    >
                      <input
                        type="text"
                        value={form.line2}
                        onChange={(e) => update("line2", e.target.value)}
                        placeholder="Street / Area / Landmark"
                        className={inputCls()}
                        autoComplete="address-line2"
                      />
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                      <Field
                        label="Pincode"
                        icon={<FiTag size={14} />}
                        error={errors.pincode}
                      >
                        <div className="relative">
                          <input
                            type="text"
                            inputMode="numeric"
                            value={form.pincode}
                            onChange={(e) =>
                              update(
                                "pincode",
                                e.target.value.replace(/\D/g, "").slice(0, 6),
                              )
                            }
                            placeholder="6-digit pincode"
                            maxLength={6}
                            className={inputCls(errors.pincode) + " pr-9"}
                            autoComplete="postal-code"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            {pinStatus === "checking" && (
                              <FiLoader
                                size={14}
                                className="text-gray-400 animate-spin"
                              />
                            )}
                            {pinStatus &&
                              pinStatus !== "checking" &&
                              pinStatus.serviceable === true && (
                                <FiCheckCircle
                                  size={14}
                                  className="text-green-500"
                                />
                              )}
                            {pinStatus &&
                              pinStatus !== "checking" &&
                              pinStatus.serviceable === false && (
                                <FiX size={14} className="text-red-500" />
                              )}
                          </div>
                        </div>
                        {pinStatus && pinStatus !== "checking" && (
                          <div className="mt-1.5">
                            {pinStatus.serviceable &&
                              pinStatus.city &&
                              !pinStatus.timedOut && (
                                <p className="text-xs text-green-600 flex items-center gap-1">
                                  <MdLocalShipping size={12} />
                                  Delivery available — {pinStatus.city}
                                  {pinStatus.state
                                    ? `, ${pinStatus.state}`
                                    : ""}
                                </p>
                              )}
                            {pinStatus.serviceable && pinStatus.timedOut && (
                              <p className="text-xs text-amber-600 flex items-center gap-1">
                                <FiAlertCircle size={12} />
                                Could not verify — you can still proceed
                              </p>
                            )}
                            {!pinStatus.serviceable && (
                              <p className="text-xs text-red-500 flex items-center gap-1">
                                <FiAlertCircle size={12} />
                                {pinStatus.message ||
                                  "Delivery not available at this pincode"}
                              </p>
                            )}
                          </div>
                        )}
                      </Field>
                      <Field label="City" error={errors.city}>
                        <input
                          type="text"
                          value={form.city}
                          onChange={(e) => update("city", e.target.value)}
                          placeholder="City / District"
                          className={inputCls(errors.city)}
                          autoComplete="address-level2"
                        />
                      </Field>
                    </div>
                    <Field label="State" error={errors.state}>
                      <select
                        value={form.state}
                        onChange={(e) => update("state", e.target.value)}
                        className={inputCls(errors.state)}
                      >
                        <option value="">Select state...</option>
                        {STATES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>
                </div>

                {shippingCharge > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3.5 flex items-center gap-3">
                    <FiTruck
                      size={16}
                      className="text-amber-600 flex-shrink-0"
                    />
                    <p className="text-sm text-amber-700">
                      Add{" "}
                      <strong>
                        ₹
                        {(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString(
                          "en-IN",
                        )}
                      </strong>{" "}
                      more to get <strong>FREE shipping!</strong>
                    </p>
                  </div>
                )}

                <button
                  onClick={handleProceedToReview}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-[#da3f3f] text-white font-semibold rounded-2xl hover:bg-[#c03535] transition-all shadow-lg shadow-red-900/20 text-sm active:scale-[0.99]"
                >
                  Continue to Review &amp; Pay <FiChevronRight size={16} />
                </button>
              </>
            )}

            {/* ── STEP 2 ── */}
            {step === 2 && (
              <>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FiMapPin size={15} className="text-[#da3f3f]" />
                      <h2 className="font-semibold text-gray-900 text-sm">
                        Delivering To
                      </h2>
                    </div>
                    <button
                      onClick={() => setStep(1)}
                      className="text-xs text-[#da3f3f] font-semibold hover:underline"
                    >
                      Change
                    </button>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3.5 text-sm leading-relaxed">
                    <p className="font-semibold text-gray-900">{form.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {form.phone} · {form.email}
                    </p>
                    <p className="text-xs text-gray-600 mt-1.5">
                      {form.line1}
                      {form.line2 ? ", " + form.line2 : ""}, {form.city},{" "}
                      {form.state} — {form.pincode}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                    <FiPackage size={15} className="text-[#da3f3f]" />
                    <h2 className="font-semibold text-gray-900 text-sm">
                      Order Items ({cart.length})
                    </h2>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {cart.map((item, i) => (
                      <div key={i} className="flex gap-3.5 p-4">
                        <div className="w-14 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug">
                            {item.title}
                          </p>
                          {item.size && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              Size: {item.size}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-0.5">
                            Qty: {item.qty}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-bold text-gray-900">
                            ₹{(item.price * item.qty).toLocaleString("en-IN")}
                          </p>
                          <p className="text-xs text-gray-400">
                            ₹{item.price.toLocaleString("en-IN")} each
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      icon: FiLock,
                      label: "Secure Payment",
                      sub: "256-bit SSL",
                    },
                    {
                      icon: FiTruck,
                      label: "Fast Delivery",
                      sub: "via Delhivery",
                    },
                    {
                      icon: MdVerified,
                      label: "Genuine Products",
                      sub: "Quality Assured",
                    },
                  ].map(({ icon: Icon, label, sub }) => (
                    <div
                      key={label}
                      className="bg-white rounded-2xl p-3.5 text-center border border-gray-100 shadow-sm"
                    >
                      <Icon
                        size={18}
                        className="mx-auto text-[#da3f3f] mb-1.5"
                      />
                      <p className="text-xs font-semibold text-gray-800">
                        {label}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-3.5 flex items-start gap-3">
                  <FiMail
                    size={15}
                    className="text-blue-500 mt-0.5 flex-shrink-0"
                  />
                  <p className="text-xs text-blue-700 leading-relaxed">
                    A confirmation email with your{" "}
                    <strong>Delhivery tracking ID</strong> will be sent to{" "}
                    <strong>{form.email}</strong> after payment.
                  </p>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-[#da3f3f] text-white font-bold rounded-2xl hover:bg-[#c03535] transition-all shadow-lg shadow-red-900/20 text-base disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99]"
                >
                  {loading ? (
                    <>
                      <FiLoader size={18} className="animate-spin" /> Processing
                      Payment…
                    </>
                  ) : (
                    <>
                      <FiLock size={16} /> Pay ₹{total.toLocaleString("en-IN")}{" "}
                      Securely
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-gray-400">
                  By placing this order you agree to our{" "}
                  <a
                    href="/terms"
                    className="underline hover:text-gray-600"
                    target="_blank"
                  >
                    Terms &amp; Conditions
                  </a>
                </p>
              </>
            )}
          </div>

          {/* RIGHT: Order summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-20">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                <FiShoppingBag size={15} className="text-[#da3f3f]" />
                <h2 className="font-semibold text-gray-900 text-sm">
                  Order Summary
                </h2>
                <span className="ml-auto text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                  {cart.reduce((a, i) => a + i.qty, 0)} items
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-gray-50">
                {cart.map((item, i) => (
                  <div key={i} className="flex gap-3 p-3.5">
                    <div className="w-12 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {item.image && (
                        <img
                          src={item.image}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800 line-clamp-2 leading-snug">
                        {item.title}
                      </p>
                      {item.size && (
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {item.size} · x{item.qty}
                        </p>
                      )}
                    </div>
                    <p className="text-xs font-bold text-gray-900 flex-shrink-0">
                      ₹{(item.price * item.qty).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>
              <div className="px-5 py-4 border-t border-gray-100 space-y-2.5">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-1.5">
                    <FiTruck size={13} /> Shipping
                  </span>
                  <span
                    className={
                      shippingCharge === 0
                        ? "text-green-600 font-semibold"
                        : "text-gray-700"
                    }
                  >
                    {shippingCharge === 0 ? "FREE" : `₹${shippingCharge}`}
                  </span>
                </div>
                {shippingCharge > 0 && (
                  <p className="text-[10px] text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-2.5 py-1.5">
                    Add ₹
                    {(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString(
                      "en-IN",
                    )}{" "}
                    more for free shipping
                  </p>
                )}
                <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span>₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>
              <div className="px-5 pb-4">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <FiShield size={12} className="text-green-500" /> Payments
                  secured by Razorpay
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputCls = (err) =>
  "w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:bg-white transition-all " +
  (err
    ? "border-red-300 focus:border-red-400"
    : "border-gray-200 focus:border-[#da3f3f]");

const Field = ({ label, icon, error, children }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
      <span className="inline-flex items-center gap-1.5">
        {icon && <span className="text-gray-400">{icon}</span>}
        {label}
      </span>
    </label>
    {children}
    {error && (
      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
        <FiAlertCircle size={11} />
        {error}
      </p>
    )}
  </div>
);
